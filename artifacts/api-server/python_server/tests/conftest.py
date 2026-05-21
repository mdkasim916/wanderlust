import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch


# ---------------------------------------------------------------------------
# Shared fixtures
# ---------------------------------------------------------------------------

@pytest.fixture(scope="session")
def client():
    """FastAPI test client — no real DB connection needed."""
    from main import app
    return TestClient(app)


@pytest.fixture()
def mock_conn():
    """
    Patch main.get_conn so no real Postgres connection is required.
    Yields the mock connection; tests configure its cursor as needed.
    """
    with patch("main.get_conn") as mock_get_conn:
        conn = MagicMock()
        cursor = MagicMock()
        conn.cursor.return_value = cursor
        mock_get_conn.return_value = conn
        yield conn, cursor


# ---------------------------------------------------------------------------
# Shared sample data
# ---------------------------------------------------------------------------

SAMPLE_DESTINATION = {
    "id": 1,
    "name": "Santorini Sunset Escape",
    "country": "Greece",
    "category": "Luxury",
    "description": "Experience the iconic whitewashed villages and caldera views.",
    "imageUrl": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    "price": 2499.0,
    "rating": 4.9,
    "reviewCount": 312,
    "duration": 7,
    "maxGroupSize": 8,
    "highlights": "Caldera views, wine tasting, sunset cruise",
}

SAMPLE_BOOKING = {
    "id": 1,
    "bookingRef": "WL-TESTREF1",
    "destinationId": 1,
    "destinationName": "Santorini Sunset Escape",
    "destinationImageUrl": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+44 7700 900123",
    "adults": 2,
    "children": 0,
    "travelers": 2,
    "checkIn": "2026-08-01",
    "checkOut": "2026-08-08",
    "roomType": "Standard",
    "nights": 7,
    "specialRequests": None,
    "status": "confirmed",
    "basePrice": 34986.0,
    "taxAmount": 4198.32,
    "totalPrice": 39184.32,
    "createdAt": "2026-05-21T00:00:00",
}

SAMPLE_DESTINATION_DB_ROW = {
    "id": 1,
    "name": "Santorini Sunset Escape",
    "image_url": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    "price": 2499.0,
}
