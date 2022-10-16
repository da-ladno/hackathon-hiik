function Slider({sliderValue, setInputValue}) {
    const handleChange = (event) => {
        setInputValue(event.target.value);
    }
    return (
        <div className={'slider'}>
            {/* <div className={'sliderText'}>в радиусе:</div> */}
            <div>
                <datalist id='sliderValues' className={'sliderValues'} >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </datalist>
                <input className={'slider'} type='range' min='1' max='10' value={sliderValue} step='1' onChange={handleChange} />
            </div>
            {/* <div className={'sliderText'}>км</div> */}
        </div>
    );
}

export default Slider;