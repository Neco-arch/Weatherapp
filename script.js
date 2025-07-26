const SubmitButton = document.querySelector(".SubmitButton");

async function CallAPI(CityNameInput) {
    const ReturnResult = [];
    const CityName = CityNameInput;

    const BuildRequest = new Request(
        `http://api.weatherapi.com/v1/current.json?key=a2d4f81ad30b4d0689d44909252407&q=${CityName}`,
        {
            method: "GET",
            mode: "cors",
        }
    );

    const Data = await fetch(BuildRequest).then((request) => {
        if (!request.ok) {
            return request;
        } else {
            return request.json();
        }
    });


    if (Data.status === 403 || Data.status === 401 || Data.status === 400) {
        const loading_screen = document.querySelector("#loading-screen")
        loading_screen.style.display = "none"

        alert(Data.statusText);
    } else {
        ReturnResult.push(
            Data.location.name,
            Data.location.region,
            Data.location.country,
            Data.current.temp_c,
            Data.current.temp_f,
            Data.current.condition.text,
            Data.current.condition.icon
        );
        return ReturnResult;
    }
}

function Main() {
    const CityInput = document.querySelector("#CityInput");
    if (CityInput.value === "") {
        alert("Please put city name on search bar");
        return;
    } else {
        const CityName = document.querySelector("#CityName");
        const Weatherimage = document.querySelector("#WeatherImg");
        const Tempurture = document.querySelector("#Tempurture")
        const loading_screen = document.querySelector("#loading-screen");
        const Condition = document.querySelector("#Condition")
        const ChangeUnit = document.querySelector(".CheckUnit")
        loading_screen.style.display = "flex";
        CityName.textContent = "";
        Weatherimage.src = "";
        Tempurture.textContent = "";
        Condition.textContent = "";
        const City = CityInput.value;
        CityInput.value = "";
        let Full_Cityname = "";
        setTimeout(() => {
            const ReturnedResult = CallAPI(City).then((Array) => {
                CityName.textContent = "";
                Tempurture.textContent = "";
                Weatherimage.src = "";
                Full_Cityname = Array[0] + "," + " " + Array[1] + "," + " " + Array[2];
                loading_screen.style.display = "none"
                CityName.textContent = Full_Cityname
                Condition.textContent = Array?.[5]
                Weatherimage.src = Array[6]
                if (!ChangeUnit.checked) {
                    Tempurture.textContent = Array[3] + "°C"
                } else {
                    Tempurture.textContent = Array[4] + "°F"
                }
            });
        }, 1000)

    }
}

document.querySelector(".SubmitButton").addEventListener("click", (e) => {
    e.preventDefault();
    Main();
})

document.querySelector("#CityInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        Main()
    } else {
        return
    }
})



document.querySelector(".CheckUnit").addEventListener("click", () => {
    const Tempurture = document.querySelector("#Tempurture");
    const textContent = Tempurture.textContent;

    if (textContent.endsWith("C")) {

        const celsiusString = textContent.slice(0, -1);
        const Calcius = parseFloat(celsiusString);

        if (!isNaN(Calcius)) {
            Tempurture.textContent = ((Calcius * 9) / 5 + 32).toFixed(1) + "°F";
        } else {
            console.error("Could not parse Celsius temperature:", celsiusString);
        }
    } else if (textContent.endsWith("F")) {
        const fahrenheitString = textContent.slice(0, -1);
        const Fahrenheit = parseFloat(fahrenheitString);

        if (!isNaN(Fahrenheit)) {
            Tempurture.textContent = ((Fahrenheit - 32) * 5 / 9).toFixed(1) + "°C";
        } else {
            console.error("Could not parse Fahrenheit temperature:", fahrenheitString);
        }
    } else {
        console.warn("Temperature unit not recognized (expected 'C' or 'F'):", textContent);
    }
});