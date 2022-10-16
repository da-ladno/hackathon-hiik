import React from 'react'

const Modal = ({active, setActive, setBadGeo, modalObject}) => {

    const days = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье']
    
    if(!active) return

  return (
<div className="modal">
    <div className="modal-content">
        <ul className="header">
            <li>{modalObject.typeCode === 'ГОПС' ? 'Отделение' : 'Почтомат' }</li>
            <li>{modalObject.postalCode}</li>
            <li>{modalObject.addressSource}</li>
            <li className={modalObject.isClosed ? 'closed' : 'open'}>{modalObject.isClosed ? 'Закрыто' : 'Открыто'}</li>
        </ul>
        <ul className="schedule">
            {modalObject.workingHours.map(day =>  
                <li key={day.weekDayId}>
                    <h4>{days[day.weekDayId - 1]}</h4>
                    <p>
                        {day.beginWorkTime === null ? 'Закрыто' : `${day.beginWorkTime} - ${day.endWorkTime}`}
                    </p>
                </li>
            )}
        </ul>
        <ul className="modal-footer">
            <li>Широта: {modalObject.latitude}</li>
            <li>Долгота: {modalObject.longitude}</li>
        </ul>
        <button className="close" onClick={() => {setActive(false); setBadGeo([[0,0],[0,0]])}}>&nbsp;</button>
    </div>
</div>
  )
}

export default Modal