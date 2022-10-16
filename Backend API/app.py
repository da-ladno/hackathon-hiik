from typing import Tuple
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from math import sqrt,atan,pi
import httpx
import pyproj
import haversine as hs
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from timezonefinder import TimezoneFinder
import pytz
import time

tf = TimezoneFinder()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
)

def distance_between(point1: Tuple[float, float], point2: Tuple[float, float]):
    geod = pyproj.Geod(ellps='WGS84')
    lons = [point1[0], point2[0]]
    lats = [point1[1], point2[1]]
    return hs.haversine(point1, point2, unit=hs.Unit.METERS)

def is_closed(office):
    tz = pytz.timezone(tf.timezone_at(lat=float(office['latitude']), lng=float(office['longitude'])))
    local_datetime = datetime.fromtimestamp(time.time(), tz)
    local_time = datetime.strptime(f'{local_datetime.hour}:{local_datetime.minute}', "%H:%M")
    weekday = local_datetime.weekday()

    # print(office)
    if len(office['workingHours']) - 1 >= weekday:
        working_hours = office['workingHours'][weekday]
    else:
        return True
    if not working_hours['beginWorkTime']:
        return True

    work_time = (datetime.strptime(working_hours['beginWorkTime'], "%H:%M"), datetime.strptime(working_hours['endWorkTime'], "%H:%M"))
    
    lunches = office['workingHours'][weekday]["lunches"]
    if lunches:
        lunch_time = (datetime.strptime(lunches[0]["beginLunchTime"], "%H:%M"), datetime.strptime(lunches[0]["endLunchTime"], "%H:%M")) 

    #print(work_time)
    #print(local_time)

    if ((
        local_time >= work_time[0]
         and
        local_time <= work_time[1]
    ) and not (
        lunches
         and
        local_time >= lunch_time[0]
         and
        local_time <= lunch_time[1]
    )) or (
        work_time == ((0, 0), (0, 0))
    ):
        #print(False)
        return False

    #print(True)
    return True


@app.get("/")
async def root():
    return RedirectResponse("/docs")

@app.get("/get_offices")
async def get_offices(latitude: float, longitude: float, radius: int, return_closed: bool = False):
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
            'limit': 1000
        }
        resp = await client.post('https://www.pochta.ru/offices', params=params, data=form_data, timeout=30)
        j = resp.json()['response']

    # Фильтруем отделения дальше, чем указанный радиус
    filtered_offices = []
    for office in j['postOffices']:
        if distance_between((float(office['latitude']), float(office['longitude'])), (latitude, longitude)) <= radius * 1000:
            filtered_offices.append(office)

    filtered_offices.sort(key=lambda x: distance_between((float(x["latitude"]), float(x["longitude"])), (latitude, longitude)))
    
    # Фиксим поле isClosed
    for i, office in enumerate(filtered_offices):
        filtered_offices[i]['isClosed'] = is_closed(office)
    
    # Удаляем закрытые, если не сказано их возвращать
    if not return_closed:
        filtered_offices = list(filter(lambda x: not x['isClosed'], filtered_offices))      

    j['postOffices'] = filtered_offices
    j['totalCount'] = len(filtered_offices)

    return j

@app.get('/get_office_info')
async def get_office_info(postal_code: int, local_time: int):
    async with httpx.AsyncClient() as client:
        params = {
            'p_p_id': 'postOfficeSearchPortlet_WAR_portalportlet',
            'p_p_lifecycle': 2,
            'p_p_state': 'normal',
            'p_p_mode': 'view',
            'p_p_resource_id': 'postoffices.get-office-with-historic-load',
            'p_p_cacheability': 'cacheLevelPage',
            'p_p_col_id': 'column-1',
            'p_p_col_count': 1,
            'postalCode': postal_code,
            'localDateTime': datetime.fromtimestamp(local_time).strftime("%Y-%m-%dT%H:%M:%S")
        }
        resp = await client.get('https://www.pochta.ru/offices', params=params)

    office = resp.json()['response']['office']
    office['isClosed'] = is_closed(office)
    return office
