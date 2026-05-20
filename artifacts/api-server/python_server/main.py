import os
import random
import string
from contextlib import asynccontextmanager
from typing import Optional

import psycopg2
import psycopg2.extras
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

DATABASE_URL = os.environ.get("DATABASE_URL")


def get_conn():
    return psycopg2.connect(DATABASE_URL, cursor_factory=psycopg2.extras.RealDictCursor)


def generate_booking_ref() -> str:
    chars = string.ascii_uppercase + string.digits
    return "WL-" + "".join(random.choices(chars, k=8))


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="WanderLux API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Models ----------

class DestinationOut(BaseModel):
    id: int
    name: str
    country: str
    category: str
    description: str
    imageUrl: str
    price: float
    rating: float
    reviewCount: int
    duration: int
    maxGroupSize: int
    highlights: Optional[str] = None


class BookingInput(BaseModel):
    destinationId: int
    fullName: str
    email: str
    travelers: int
    specialRequests: Optional[str] = None


class BookingOut(BaseModel):
    id: int
    bookingRef: str
    destinationId: int
    destinationName: str
    destinationImageUrl: Optional[str] = None
    fullName: str
    email: str
    travelers: int
    specialRequests: Optional[str] = None
    status: str
    totalPrice: float
    createdAt: str


class TestimonialOut(BaseModel):
    id: int
    authorName: str
    authorAvatar: Optional[str] = None
    rating: int
    comment: str
    destination: str
    createdAt: str


class SiteStats(BaseModel):
    totalDestinations: int
    totalBookings: int
    totalCountries: int
    happyTravelers: int


# ---------- Routes ----------

@app.get("/api/healthz")
def health_check():
    return {"status": "ok"}


@app.get("/api/destinations", response_model=list[DestinationOut])
def list_destinations(
    category: Optional[str] = Query(None),
    minPrice: Optional[float] = Query(None),
    maxPrice: Optional[float] = Query(None),
    search: Optional[str] = Query(None),
):
    conn = get_conn()
    try:
        cur = conn.cursor()
        query = """
            SELECT id, name, country, category, description, image_url as "imageUrl",
                   price, rating, review_count as "reviewCount", duration,
                   max_group_size as "maxGroupSize", highlights
            FROM destinations WHERE 1=1
        """
        params = []
        if category:
            query += " AND category = %s"
            params.append(category)
        if minPrice is not None:
            query += " AND price >= %s"
            params.append(minPrice)
        if maxPrice is not None:
            query += " AND price <= %s"
            params.append(maxPrice)
        if search:
            query += " AND name ILIKE %s"
            params.append(f"%{search}%")
        query += " ORDER BY rating DESC"
        cur.execute(query, params)
        rows = cur.fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


@app.get("/api/destinations/featured", response_model=list[DestinationOut])
def list_featured_destinations():
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT id, name, country, category, description, image_url as "imageUrl",
                   price, rating, review_count as "reviewCount", duration,
                   max_group_size as "maxGroupSize", highlights
            FROM destinations ORDER BY rating DESC LIMIT 6
        """)
        return [dict(r) for r in cur.fetchall()]
    finally:
        conn.close()


@app.get("/api/destinations/{destination_id}", response_model=DestinationOut)
def get_destination(destination_id: int):
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT id, name, country, category, description, image_url as "imageUrl",
                   price, rating, review_count as "reviewCount", duration,
                   max_group_size as "maxGroupSize", highlights
            FROM destinations WHERE id = %s
        """, (destination_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Destination not found")
        return dict(row)
    finally:
        conn.close()


@app.get("/api/bookings", response_model=list[BookingOut])
def list_bookings():
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT id, booking_ref as "bookingRef", destination_id as "destinationId",
                   destination_name as "destinationName",
                   destination_image_url as "destinationImageUrl",
                   full_name as "fullName", email, travelers,
                   special_requests as "specialRequests", status, total_price as "totalPrice",
                   created_at as "createdAt"
            FROM bookings ORDER BY created_at DESC
        """)
        rows = cur.fetchall()
        result = []
        for r in rows:
            d = dict(r)
            d["createdAt"] = d["createdAt"].isoformat()
            result.append(d)
        return result
    finally:
        conn.close()


@app.post("/api/bookings", response_model=BookingOut, status_code=201)
def create_booking(body: BookingInput):
    if len(body.fullName.strip()) < 2:
        raise HTTPException(status_code=400, detail="Full name must be at least 2 characters")
    if body.travelers < 1:
        raise HTTPException(status_code=400, detail="Travelers must be at least 1")

    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, name, image_url, price FROM destinations WHERE id = %s",
            (body.destinationId,)
        )
        dest = cur.fetchone()
        if not dest:
            raise HTTPException(status_code=400, detail="Destination not found")

        total_price = dest["price"] * body.travelers
        booking_ref = generate_booking_ref()

        cur.execute("""
            INSERT INTO bookings
              (booking_ref, destination_id, destination_name, destination_image_url,
               full_name, email, travelers, special_requests, status, total_price)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'confirmed', %s)
            RETURNING id, booking_ref as "bookingRef", destination_id as "destinationId",
                      destination_name as "destinationName",
                      destination_image_url as "destinationImageUrl",
                      full_name as "fullName", email, travelers,
                      special_requests as "specialRequests", status,
                      total_price as "totalPrice", created_at as "createdAt"
        """, (
            booking_ref, body.destinationId, dest["name"], dest["image_url"],
            body.fullName, body.email, body.travelers,
            body.specialRequests, total_price
        ))
        conn.commit()
        row = cur.fetchone()
        d = dict(row)
        d["createdAt"] = d["createdAt"].isoformat()
        return d
    finally:
        conn.close()


@app.get("/api/bookings/{booking_id}", response_model=BookingOut)
def get_booking(booking_id: int):
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT id, booking_ref as "bookingRef", destination_id as "destinationId",
                   destination_name as "destinationName",
                   destination_image_url as "destinationImageUrl",
                   full_name as "fullName", email, travelers,
                   special_requests as "specialRequests", status, total_price as "totalPrice",
                   created_at as "createdAt"
            FROM bookings WHERE id = %s
        """, (booking_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Booking not found")
        d = dict(row)
        d["createdAt"] = d["createdAt"].isoformat()
        return d
    finally:
        conn.close()


@app.get("/api/testimonials", response_model=list[TestimonialOut])
def list_testimonials():
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT id, author_name as "authorName", author_avatar as "authorAvatar",
                   rating, comment, destination, created_at as "createdAt"
            FROM testimonials ORDER BY created_at DESC
        """)
        rows = cur.fetchall()
        result = []
        for r in rows:
            d = dict(r)
            d["createdAt"] = d["createdAt"].isoformat()
            result.append(d)
        return result
    finally:
        conn.close()


@app.get("/api/stats", response_model=SiteStats)
def get_stats():
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) as cnt FROM destinations")
        total_destinations = cur.fetchone()["cnt"]
        cur.execute("SELECT COUNT(*) as cnt FROM bookings")
        total_bookings = cur.fetchone()["cnt"]
        return {
            "totalDestinations": total_destinations,
            "totalBookings": total_bookings,
            "totalCountries": 42,
            "happyTravelers": 15800 + total_bookings,
        }
    finally:
        conn.close()


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
