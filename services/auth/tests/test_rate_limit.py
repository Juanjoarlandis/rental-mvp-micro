from app.core.ratelimit import limiter

def test_rate_limit_on_signup(client):
    """
    Reactivamos temporalmente el limiter y superamos el umbral 5/min → 429.
    """
    limiter.enabled = True   # 🔛

    payload = {
        "email":    "rate@test.com",
        "password": "Pass12345",
    }
    # 5 peticiones permitidas
    for i in range(5):
        client.post("/api/auth/signup", json={**payload, "username": f"user{i}"})

    # 6ª → debería saltar el límite
    r_exceed = client.post("/api/auth/signup", json={**payload, "username": "user_exceed"})
    assert r_exceed.status_code == 429

    limiter.enabled = False  # 🔚  para no interferir con otros tests
