const getOfficeInfo = (callback,postalCode,localTime,setActive) => {
    fetch(`http://176.126.103.192:8000/get_office_info?postal_code=${postalCode}&local_time=${localTime}`)
        .then((response) => response.json())
        .then((data) => {callback(data);setActive(true)})
}

export default getOfficeInfo

