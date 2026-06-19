from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.routes import auth, crm, users

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(crm.projects_router)
api_router.include_router(crm.properties_router)
api_router.include_router(crm.owners_router)
api_router.include_router(crm.customers_router)
api_router.include_router(crm.requirements_router)
api_router.include_router(crm.matching_router)
api_router.include_router(crm.viewings_router)
api_router.include_router(crm.deals_router)
api_router.include_router(crm.commissions_router)
api_router.include_router(crm.activities_router)
api_router.include_router(crm.settings_router)
api_router.include_router(crm.dashboard_router)
api_router.include_router(crm.public_router)
