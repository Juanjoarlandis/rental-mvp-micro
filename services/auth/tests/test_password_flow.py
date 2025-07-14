from uuid import uuid4

def test_password_reset_flow(client):
    """Genera reset_token, restablece contraseña y verifica login."""
    # 1️⃣  Alta
    uname = f"user_{uuid4().hex[:8]}"
    client.post(
        "/api/auth/signup",
        json={"username": uname, "email": f"{uname}@mail.com", "password": "OldPass123"},
    )

    # 2️⃣  Obtener reset_token
    r_forgot = client.post("/api/auth/password/forgot", json={"username": uname})
    assert r_forgot.status_code == 200
    reset_token = r_forgot.json()["reset_token"]

    # 3️⃣  Reset OK
    r_reset = client.post(
        "/api/auth/password/reset",
        json={"token": reset_token, "new_password": "NewPass456"},
    )
    assert r_reset.status_code == 204

    # 4️⃣  Login con nueva contraseña
    r_login_new = client.post(
        "/api/auth/token",
        data={"username": uname, "password": "NewPass456"},
    )
    assert r_login_new.status_code == 200

    # 5️⃣  Login con contraseña antigua debe fallar
    r_login_old = client.post(
        "/api/auth/token",
        data={"username": uname, "password": "OldPass123"},
    )
    assert r_login_old.status_code == 401
