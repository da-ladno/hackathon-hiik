import { useState } from "react";

function Slider() {
    const [sliderValue = 5, setInputValue] = useState("");
    const handleChange = (event) => {
        setInputValue(event.target.value);
    }
    return (
        <span className={'slider'}><input type='range' min='1' max='10' value={sliderValue} step='1' onChange={handleChange} className={'slider'} /></span>
    );
}

export default Slider;