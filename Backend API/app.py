from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from math import sqrt,atan,pi
import httpx
import pyproj

app = FastAPI()

@app.get("/")
async def root():
    return RedirectResponse("/docs")

@app.get("/get_offices_latlon")
async def latlon_api(latitude: float, longitude: float, radius: int):
    # Вычисляем углы прямоугольной области
    geod = pyproj.Geod(ellps='WGS84')

    width = radius * 1000
    height = radius * 1000
    rect_diag = sqrt( width**2 + height**2 )

    azimuth2 = atan(-width/height)
    azimuth4 = atan(-width/height)+pi

    pt2_lon, pt2_lat, _ = geod.fwd(longitude, latitude, azimuth2*180/pi, rect_diag)
    pt4_lon, pt4_lat, _ = geod.fwd(longitude, latitude, azimuth4*180/pi, rect_diag)   

    # Получаем список отделений в заданном радиусе используя API Почты России
    async with httpx.AsyncClient() as client:
        # p_p_id=postOfficeSearchPortlet_WAR_portalportlet&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=postoffices.find-from-rectangle&p_p_cacheability=cacheLevelPage&p_p_col_id=column-1&p_p_col_count=1
        params = {
            'p_p_id': 'postOfficeSearchPortlet_WAR_portalportlet',
            'p_p_lifecycle': 2,
            'p_p_state': 'normal',
            'p_p_mode': 'view',
            'p_p_resource_id': 'postoffices.find-from-rectangle',
            'p_p_cacheability': 'cacheLevelPage',
            'p_p_col_id': 'column-1',
            'p_p_col_count': 1
        }
        form_data = {
            'extFilters': ['NOT_TEMPORARY_CLOSED', 'NOT_PRIVATE', "NOT_CLOSED", 'ONLY_ATI'],
            'topLeftPoint.latitude': pt2_lat,
            'topLeftPoint.longitude': pt2_lon,
            'bottomRightPoint.latitude': pt4_lat,
            'bottomRightPoint.longitude': pt4_lon,
            'precision': 0,
            'onlyCoordinate': False,
            'offset': 0,
            'limit': 10000
        }
        resp = await client.post('https://www.pochta.ru/offices', params=params, data=form_data)
        j = resp.json()
        return j
