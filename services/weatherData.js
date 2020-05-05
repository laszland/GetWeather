// ! TODO: hide api_key
const API_KEY = '1530aa66981635041aef3f4c08f2d21c';

export const getWeatherData = async (lat, lng) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`)
    const data = await response.json();
    return data;
  } catch(err) {
    console.error(err);
  }
};