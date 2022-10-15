from typing import List, Tuple
import telebot
from telebot import types
import os
from dotenv import load_dotenv
import requests
import pyproj
import haversine as hs
import re
import time

office_regex = r"✉️\s([0-9]{5,6})\s\-\s(.*)\s-\s([0-9]{1,})"

load_dotenv()

bot = telebot.TeleBot(os.environ['TOKEN'], parse_mode="markdown")

def distance_between(point1: Tuple[float, float], point2: Tuple[float, float]):
    geod = pyproj.Geod(ellps='WGS84')
    lons = [point1[0], point2[0]]
    lats = [point1[1], point2[1]]
    return hs.haversine(point1, point2, unit=hs.Unit.METERS)

def main_menu():
    markup = types.ReplyKeyboardMarkup(row_width=1, one_time_keyboard=True)
    request_location_btn = types.KeyboardButton("📍 Отправить текущее местоположение", request_location=True)
    request_address_btn = types.KeyboardButton("✏️ Ввести адрес вручную")
    markup.add(request_location_btn, request_address_btn)
    return markup

def offices_list(loc: Tuple[float, float], office_list: List):
    # Сортируем отделения по удаленности и оставляем 5 ближайших
    office_list.sort(key=lambda x: distance_between((float(x["latitude"]), float(x["longitude"])), (loc[0], loc[1])))
    office_list = office_list[:5]

    # Составляем клавиатуру отделений
    markup = types.ReplyKeyboardMarkup(one_time_keyboard=False, row_width=1)
    for office in office_list:
        distance = int(distance_between( (float(office["latitude"]), float(office["longitude"])), (loc[0], loc[1]) ))
        markup.add(types.KeyboardButton(f"✉️ {office['postalCode']} - {office['addressSource']} - {distance} м."))
    markup.add(types.KeyboardButton("Назад"))
    return markup

def is_address_reply(message):
    if message.reply_to_message:
        return message.reply_to_message.text == 'Введите адрес в ответ на данное сообщение'

@bot.message_handler(commands=['start', 'help'])
def welcome_message(message):
    bot.send_message(message.chat.id, "Привет, этот бот поможет вам найти ближайшие отделения почты. Для продолжения, выберите действие.", 
                    reply_markup=main_menu())

@bot.message_handler(content_types=['location'])
def location_handler(message):
    lat = message.location.latitude
    lon = message.location.longitude

    # Получаем списки офисов через АПИ
    resp = requests.get('http://localhost:8000/get_offices', params={'latitude': lat, "longitude": lon, "radius": 5}).json()

    bot.send_message(message.chat.id, f"Найдено {resp['totalCount']} открытых отделений в радиусе 5 километров. Показаны 5 ближайших. Выберите отделение для получения подробной информации.", reply_markup=offices_list((lat, lon), resp['postOffices']))

@bot.message_handler(regexp="✏️ Ввести адрес вручную")
def address_handler(message):
    force_reply = types.ForceReply()
    bot.send_message(message.chat.id, "Введите адрес в ответ на данное сообщение", reply_markup=force_reply)

@bot.message_handler(regexp="Назад")
def back_to_main_menu(message):
    bot.send_message(message.chat.id, 'Выберите действие', reply_markup=main_menu())

@bot.message_handler(func=is_address_reply)
def address_reply_handler(message):
    address = message.text

    # Получаем координаты по адресу
    resp = requests.get(f"https://geocode-maps.yandex.ru/1.x/?apikey={os.environ['YANDEX_API_KEY']}",
                        params={"geocode": address, "format": "json"}).json()
    print(resp)
    try:
        loc_str = resp["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["Point"]["pos"]
        lon, lat = float(loc_str.split()[0]), float(loc_str.split()[1])
    except Exception:
        bot.send_message(message.chat.id, "Не удалось получить информацию об адресе", reply_markup=main_menu())
        return

    # Получаем списки офисов через АПИ по координатам
    resp = requests.get('http://localhost:8000/get_offices', params={'latitude': lat, "longitude": lon, "radius": 5}).json()
    bot.send_message(message.chat.id, f"Найдено {resp['totalCount']} открытых отделений в радиусе 5 километров. Показаны 5 ближайших. Выберите отделение для получения подробной информации.", reply_markup=offices_list((lat, lon), resp['postOffices']))

@bot.message_handler(regexp=office_regex)
def office_click_handler(message):
    postal_code = int(re.match(office_regex, message.text).group(1))
    j = requests.get('http://localhost:8000/get_office_info', params={"postal_code": postal_code, "local_time": int(time.time())}).json()
    message_output = f"✉️  Отделение почты {j['postalCode']} \n"
    message_output += f"Адрес: {j['addressSource']} \n\n"
    message_output += f"📅 Имеет расписание по дням: \n\n"
    message_output += f"Понедельник: {'Закрыто' if not j['workingHours'][0]['beginWorkTime'] else j['workingHours'][0]['beginWorkTime'] + ' - ' +  j['workingHours'][0]['endWorkTime']} \n" 
    message_output += f"Вторник: {'Закрыто' if not j['workingHours'][1]['beginWorkTime'] else j['workingHours'][1]['beginWorkTime'] + ' - ' +  j['workingHours'][1]['endWorkTime']}  \n" 
    message_output += f"Среда: {'Закрыто' if not j['workingHours'][2]['beginWorkTime'] else j['workingHours'][2]['beginWorkTime'] + ' - ' +  j['workingHours'][2]['endWorkTime']}  \n" 
    message_output += f"Четверг: {'Закрыто' if not j['workingHours'][3]['beginWorkTime'] else j['workingHours'][3]['beginWorkTime'] + ' - ' +  j['workingHours'][3]['endWorkTime']} \n" 
    message_output += f"Пятница: {'Закрыто' if not j['workingHours'][4]['beginWorkTime'] else j['workingHours'][4]['beginWorkTime'] + ' - ' +  j['workingHours'][4]['endWorkTime']}  \n" 
    message_output += f"Суббота: {'Закрыто' if not j['workingHours'][5]['beginWorkTime'] else j['workingHours'][5]['beginWorkTime'] + ' - ' +  j['workingHours'][5]['endWorkTime']}  \n" 
    message_output += f"Воскресенье: {'Закрыто' if not j['workingHours'][6]['beginWorkTime'] else j['workingHours'][6]['beginWorkTime'] + ' - ' +  j['workingHours'][6]['endWorkTime']} \n" 
    
    lunches = set()
    for hours in j['workingHours']:
        if hours["beginWorkTime"] and hours["lunches"]:
            lunches.add(hours["lunches"][0]["beginLunchTime"] + '-' + hours["lunches"][0]["endLunchTime"])
    if len(lunches) == 1:        
        message_output += f"\n⏳ Перерыв {list(lunches)[0]}\n"
    
    location_msg = bot.send_location(message.chat.id, j["latitude"], j["longitude"], reply_to_message_id=message.id)
    bot.send_message(message.chat.id, message_output, reply_to_message_id=location_msg.id)

@bot.message_handler(func=lambda x: True)
def message_black_hole(message):
    bot.send_message(message.chat.id, "Извините, команда не была распознана. Выберите действие:", reply_markup=main_menu())

bot.infinity_polling()