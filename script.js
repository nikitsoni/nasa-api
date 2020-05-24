const API_KEY = 'XQYpwjq1IijIgGgUPHVRa4yu4cmshQQF0mpFJiQF'

const imgHolder = document.getElementById('img-holder')
const imgText = document.getElementById('text')
const imgCopyright = document.getElementById('copyright')
const imgTitle = document.getElementById('title')
const imgDate = document.getElementById('date')

const allSolDataContainer = document.querySelector('[data-sol-all]')
const allSolDataTemplate = document.querySelector('[data-sol-template]')


const getPictureOfTheDay = async () => {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
    const data = await response.json()
    //console.log(data)

    imgTitle.innerHTML  = data.title
    imgHolder.src = data.hdurl
    imgCopyright.innerHTML = data.copyright;
    imgText.innerHTML = data.explanation;
    imgDate.innerHTML = data.date;

}



const getWeatherData = async () => {
    const response = await fetch(`https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`)
    const data = await response.json();

    const {sol_keys, validity_checks, ...solData} = data;
    
    const dataArray = Object.entries(solData).map(([sol, data]) => {
        return {
            sol: sol,
            maxTemp: data.AT.mx,
            minTemp: data.AT.mn,
            windSpeed: data.HWS.av,
            windDirectionDegrees: data.WD.most_common.compass_degrees,
            windDirectionCardinal: data.WD.most_common.compass_point,
            season: data.Season,
            date: new Date(data.First_UTC)
        }
    })
    return dataArray
}

const displayCurrentSol = async () => {
    const sols = await getWeatherData()
    const currentSol = sols[sols.length - 1]
    document.querySelector('[data-sol]').innerText = currentSol.sol; 
    document.querySelector('[data-sol-date]').innerText = displayDate(currentSol.date); 
    document.querySelector('[data-sol-high-temp]').innerText = currentSol.maxTemp; 
    document.querySelector('[data-sol-low-temp]').innerText = currentSol.minTemp; 
    document.querySelector('[data-sol-wind-speed]').innerText = currentSol.windSpeed; 
    document.querySelector('[data-sol-wind-direction]').innerText = currentSol.windDirectionDegrees; 
    document.querySelector('[data-sol-wind-cardinal]').innerText = currentSol.windDirectionCardinal; 
    document.querySelector('[data-sol-season]').innerText = currentSol.season; 
}

const displayAllSol = async () => {
    allSolDataContainer.innerHTML = ''
    const sols = await getWeatherData()
    sols.forEach((sol, index) => {
        const solContainer = allSolDataTemplate.content.cloneNode(true)
        solContainer.querySelector('[data-sol-day-all]').innerText = sol.sol
        solContainer.querySelector('[data-sol-date-all]').innerText = displayDate(sol.date); 
        solContainer.querySelector('[data-sol-high-temp-all]').innerText = sol.maxTemp
        solContainer.querySelector('[data-sol-low-temp-all]').innerText = sol.minTemp

        allSolDataContainer.appendChild(solContainer)
    })
}

const displayDate = (date) => {
	return date.toLocaleDateString(
		undefined,
		{ day: 'numeric', month: 'long' }
	)
}


displayCurrentSol()
getPictureOfTheDay()
displayAllSol()