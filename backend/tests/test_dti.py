# tests/test_dti.py
import pytest
from httpx import AsyncClient
from main import app


@pytest.mark.anyio
async def test_happy_path():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post(
            "/api/v1/calculators/dti",
            json={"monthly_debt": 12000, "gross_income": 60000},
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["risk_level"] == "Medium"
        assert data["dti_pct"] == 20.0


@pytest.mark.anyio
async def test_negative_income():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post(
            "/api/v1/calculators/dti",
            json={"monthly_debt": 12000, "gross_income": -1},
        )
        assert resp.status_code == 422


@pytest.mark.anyio
async def test_immutability():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        post_resp = await ac.post(
            "/api/v1/calculators/dti",
            json={"monthly_debt": 10000, "gross_income": 50000},
        )
        data = post_resp.json()
        # attempt illegal update (should be 405)
        put_resp = await ac.put(
            f"/api/v1/calculators/dti/{data['history_id']}",
            json={"monthly_debt": 1, "gross_income": 1},
        )
        assert put_resp.status_code in {404, 405}
