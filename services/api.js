import axios from 'axios'

const apiBaseURL = 'https://eoyge3duj7xtdqd.m.pipedream.net/'

export const fetchAccordionData = async () => {
  const response = await axios.get(`${apiBaseURL}`)
  return response.data
}
