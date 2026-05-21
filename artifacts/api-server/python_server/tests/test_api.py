"""
WanderLux API — pytest test suite
==================================
Covers: health check, destinations, filtering, bookings, validation, stats.
Database calls are mocked so no real Postgres connection is required.
"""

import pytest
from unittest.mock import MagicMock, patch

from .conftest import SAMPLE_DESTINATION, SAMPLE_BOOKING, SAMPLE_DESTINATION_DB_ROW


# ===========================================================================
# 1. Health check
# ===========================================================================

def test_health_check_returns_ok(client):
    """GET /api/healthz should return 200 with status: ok."""
    resp = client.get("/api/healthz")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


# ===========================================================================
# 2. Destinations — list
# ===========================================================================

def test_list_destinations_returns_list(client, mock_conn):
    """GET /api/destinations should return a JSON array of destinations."""
    conn, cursor = mock_conn
    cursor.fetchall.return_value = [SAMPLE_DESTINATION]

    resp = client.get("/api/destinations")

    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["name"] == "Santorini Sunset Escape"


def test_list_destinations_empty_when_none(client, mock_conn):
    """GET /api/destinations with a search that matches nothing returns []."""
    conn, cursor = mock_conn
    cursor.fetchall.return_value = []

    resp = client.get("/api/destinations?search=zzznomatch")

    assert resp.status_code == 200
    assert resp.json() == []


def test_list_destinations_filter_by_category(client, mock_conn):
    """GET /api/destinations?category=Luxury should pass category filter."""
    conn, cursor = mock_conn
    cursor.fetchall.return_value = [SAMPLE_DESTINATION]

    resp = client.get("/api/destinations?category=Luxury")

    assert resp.status_code == 200
    data = resp.json()
    assert data[0]["category"] == "Luxury"


def test_list_destinations_filter_by_price(client, mock_conn):
    """GET /api/destinations?maxPrice=3000 should accept the filter."""
    conn, cursor = mock_conn
    cursor.fetchall.return_value = [SAMPLE_DESTINATION]

    resp = client.get("/api/destinations?maxPrice=3000")

    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


# ===========================================================================
# 3. Destinations — featured
# ===========================================================================

def test_featured_destinations_returns_up_to_six(client, mock_conn):
    """GET /api/destinations/featured should return a list (max 6)."""
    conn, cursor = mock_conn
    cursor.fetchall.return_value = [SAMPLE_DESTINATION] * 6

    resp = client.get("/api/destinations/featured")

    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) <= 6


# ===========================================================================
# 4. Destinations — single
# ===========================================================================

def test_get_destination_by_id_success(client, mock_conn):
    """GET /api/destinations/1 returns the destination."""
    conn, cursor = mock_conn
    cursor.fetchone.return_value = SAMPLE_DESTINATION

    resp = client.get("/api/destinations/1")

    assert resp.status_code == 200
    assert resp.json()["id"] == 1
    assert resp.json()["name"] == "Santorini Sunset Escape"


def test_get_destination_not_found_returns_404(client, mock_conn):
    """GET /api/destinations/99999 should return 404."""
    conn, cursor = mock_conn
    cursor.fetchone.return_value = None

    resp = client.get("/api/destinations/99999")

    assert resp.status_code == 404
    assert "not found" in resp.json()["detail"].lower()


# ===========================================================================
# 5. Bookings — create (success)
# ===========================================================================

def test_create_booking_success_returns_201(client, mock_conn):
    """POST /api/bookings with valid data should return 201 with a booking ref."""
    conn, cursor = mock_conn
    cursor.fetchone.side_effect = [
        SAMPLE_DESTINATION_DB_ROW,
        SAMPLE_BOOKING,
    ]

    payload = {
        "destinationId": 1,
        "fullName": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+44 7700 900123",
        "adults": 2,
        "children": 0,
        "checkIn": "2026-08-01",
        "checkOut": "2026-08-08",
        "roomType": "Standard",
    }
    resp = client.post("/api/bookings", json=payload)

    assert resp.status_code == 201
    data = resp.json()
    assert "bookingRef" in data
    assert data["bookingRef"].startswith("WL-")


def test_create_booking_price_calculation(client, mock_conn):
    """totalPrice should equal basePrice + taxAmount (12% tax)."""
    conn, cursor = mock_conn
    cursor.fetchone.side_effect = [
        SAMPLE_DESTINATION_DB_ROW,
        SAMPLE_BOOKING,
    ]

    payload = {
        "destinationId": 1,
        "fullName": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+44 7700 900123",
        "adults": 2,
        "children": 0,
        "checkIn": "2026-08-01",
        "checkOut": "2026-08-08",
        "roomType": "Standard",
    }
    resp = client.post("/api/bookings", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    expected_total = round(data["basePrice"] + data["taxAmount"], 2)
    assert data["totalPrice"] == expected_total


# ===========================================================================
# 6. Bookings — validation (rejections)
# ===========================================================================

def test_create_booking_invalid_email_rejected(client):
    """POST /api/bookings with a malformed email should return 422."""
    payload = {
        "destinationId": 1,
        "fullName": "Jane Smith",
        "email": "not-an-email",
        "phone": "+44 7700 900123",
        "adults": 2,
        "children": 0,
        "checkIn": "2026-08-01",
        "checkOut": "2026-08-08",
        "roomType": "Standard",
    }
    resp = client.post("/api/bookings", json=payload)
    assert resp.status_code == 422


def test_create_booking_zero_adults_rejected(client, mock_conn):
    """POST /api/bookings with adults=0 should return 400."""
    conn, cursor = mock_conn
    cursor.fetchone.return_value = SAMPLE_DESTINATION_DB_ROW

    payload = {
        "destinationId": 1,
        "fullName": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+44 7700 900123",
        "adults": 0,
        "children": 0,
        "checkIn": "2026-08-01",
        "checkOut": "2026-08-08",
        "roomType": "Standard",
    }
    resp = client.post("/api/bookings", json=payload)
    assert resp.status_code == 400


def test_create_booking_short_name_rejected(client, mock_conn):
    """POST /api/bookings with a single-character name should return 400."""
    conn, cursor = mock_conn
    cursor.fetchone.return_value = SAMPLE_DESTINATION_DB_ROW

    payload = {
        "destinationId": 1,
        "fullName": "J",
        "email": "jane@example.com",
        "phone": "+44 7700 900123",
        "adults": 2,
        "children": 0,
        "checkIn": "2026-08-01",
        "checkOut": "2026-08-08",
        "roomType": "Standard",
    }
    resp = client.post("/api/bookings", json=payload)
    assert resp.status_code == 400


def test_create_booking_invalid_room_type_rejected(client, mock_conn):
    """POST /api/bookings with an unknown roomType should return 400."""
    conn, cursor = mock_conn
    cursor.fetchone.return_value = SAMPLE_DESTINATION_DB_ROW

    payload = {
        "destinationId": 1,
        "fullName": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+44 7700 900123",
        "adults": 2,
        "children": 0,
        "checkIn": "2026-08-01",
        "checkOut": "2026-08-08",
        "roomType": "InvalidType",
    }
    resp = client.post("/api/bookings", json=payload)
    assert resp.status_code == 400


def test_create_booking_destination_not_found_rejected(client, mock_conn):
    """POST /api/bookings with a non-existent destinationId should return 400."""
    conn, cursor = mock_conn
    cursor.fetchone.return_value = None

    payload = {
        "destinationId": 99999,
        "fullName": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+44 7700 900123",
        "adults": 2,
        "children": 0,
        "checkIn": "2026-08-01",
        "checkOut": "2026-08-08",
        "roomType": "Standard",
    }
    resp = client.post("/api/bookings", json=payload)
    assert resp.status_code == 400


# ===========================================================================
# 7. Bookings — list
# ===========================================================================

def test_list_bookings_returns_list(client, mock_conn):
    """GET /api/bookings should return a JSON array."""
    conn, cursor = mock_conn
    cursor.fetchall.return_value = [SAMPLE_BOOKING]

    resp = client.get("/api/bookings")

    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert data[0]["status"] == "confirmed"


# ===========================================================================
# 8. Stats
# ===========================================================================

def test_get_stats_returns_expected_shape(client, mock_conn):
    """GET /api/stats should return totalDestinations, totalBookings, etc."""
    conn, cursor = mock_conn
    cursor.fetchone.side_effect = [
        {"cnt": 12},
        {"cnt": 5},
    ]

    resp = client.get("/api/stats")

    assert resp.status_code == 200
    data = resp.json()
    assert "totalDestinations" in data
    assert "totalBookings" in data
    assert "happyTravelers" in data
    assert data["totalDestinations"] == 12
    assert data["totalBookings"] == 5
