def test_health_ok(client):
    """El health‑check debe estar vivo y con la BD operativa."""
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"ok": True, "db": "ok"}
