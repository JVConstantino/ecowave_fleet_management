
import { ChartDataPoint, ThingSpeakResponse } from '../types';

const THING_SPEAK_API_KEY = "IZGWX6Z4PPTNHRKY"; // Provided API Key
const CHANNEL_ID = "2994510"; // Provided Channel ID
const RESULTS_COUNT = 60; // Fetch last 60 results for a trend

export const fetchTemperatureHumidityData = async (): Promise<ChartDataPoint[]> => {
  const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${THING_SPEAK_API_KEY}&results=${RESULTS_COUNT}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("ThingSpeak API Error Response:", response);
      throw new Error(`Error fetching data from ThingSpeak: ${response.statusText} (Status: ${response.status})`);
    }
    const data: ThingSpeakResponse = await response.json();

    if (!data.feeds || data.feeds.length === 0) {
      return [];
    }
    
    // Sort feeds by date just in case they are not in order, though typically they are.
    const sortedFeeds = data.feeds.sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());


    return sortedFeeds.map(feed => {
      const temperature = feed.field1 ? parseFloat(feed.field1) : null;
      const humidity = feed.field2 ? parseFloat(feed.field2) : null;
      const date = new Date(feed.created_at);
      
      // Format time: HH:MM, or DD/MM HH:MM if crossing midnight or for more context
      // For simplicity, using HH:MM for recent data. Add more logic if needed.
      const formattedTime = date.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
      });

      return {
        name: formattedTime, // X-axis label (time)
        temperature: temperature !== null && !isNaN(temperature) ? parseFloat(temperature.toFixed(1)) : undefined, // Y-axis value for temperature
        humidity: humidity !== null && !isNaN(humidity) ? parseFloat(humidity.toFixed(1)) : undefined,      // Y-axis value for humidity
        fullDate: feed.created_at // Store full date for potential tooltips or sorting
      };
    }).filter(point => point.temperature !== undefined || point.humidity !== undefined); // Ensure there's at least one valid reading

  } catch (error) {
    console.error("Failed to fetch or process ThingSpeak data:", error);
    throw error; // Re-throw to be caught by the caller
  }
};
