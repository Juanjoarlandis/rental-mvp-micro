from uuid import uuid4


def test_signup_login_me_flow(client):
    """Flujo feliz: alta → login → /me."""
    # 1️⃣  Alta de usuario
    uname = f"user_{uuid4().hex[:8]}"
    payload = {
        "username": uname,
        "email": f"{uname}@example.com",
        "password": "SuperPass123",
    }
    r_signup = client.post("/api/auth/signup", json=payload)
    assert r_signup.status_code == 201

    # 2️⃣  Alta duplicada → 409
    r_dup = client.post("/api/auth/signup", json=payload)
    assert r_dup.status_code == 409

    # 3️⃣  Login OK
    r_token = client.post(
        "/api/auth/token",
        data={"username": uname, "password": payload["password"]},
    )
    assert r_token.status_code == 200
    token = r_token.json()["access_token"]

    # 4️⃣  /me con Bearer
    headers = {"Authorization": f"Bearer {token}"}
    r_me = client.get("/api/auth/me", headers=headers)
    assert r_me.status_code == 200
    me = r_me.json()
    assert me["username"] == uname
    assert me["email"] == payload["email"]

    # 5️⃣  Login con pass incorrecto → 401
    r_bad = client.post(
        "/api/auth/token",
        data={"username": uname, "password": "wrong"},
    )
    assert r_bad.status_code == 401
