const form = document.getElementById('weather-form');
const statusMessage = document.getElementById('status-message');
const weatherResult=document.getElementById('weather-result')

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const city = formData.get('city');
    form.reset();
    console.log(city);

    let dotCount = 0;
    const loadingInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        statusMessage.textContent = `Загрузка` + `.`.repeat(dotCount);
    }, 500);

    try {
        async function getCoordinates(city) {
            const apiKeyCoordinates = 'b38ac1feb0a9419d9001f91b8c4a02b2';
            const responseCoordinates = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${apiKeyCoordinates}&language=ru`
            );

            const dataCoordinates = await responseCoordinates.json();
            if (dataCoordinates.results.length === 0) {
                throw new Error('Город не найден');
            }

            const { lat, lng } = dataCoordinates.results[0].geometry;
            return { lat, lon: lng };
        }



        const apiKeyMap = '4cc10e2b-b3c7-4819-9f78-faa9c0c4dfdb';
        const headers = {
            'X-Yandex-Weather-Key': apiKeyMap
        };

        const coordinates = await getCoordinates(city);
        const response = await fetch(
            `https://api.weather.yandex.ru/v2/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}`,
            { headers }
        );
        const data = await response.json();
        console.log(data);

        statusMessage.textContent = "";
        weatherResult.innerHTML=`
        <p>В ${city} ${data.fact.feels_like}°</p>`
    } catch (error) {
        console.error('Ошибка:', error);
        statusMessage.textContent = 'Произошла ошибка при получении данных';
    } finally {
        clearInterval(loadingInterval);
    }
});
