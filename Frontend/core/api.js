import axios from 'axios'
import { Platform } from 'react-native'


export const ADDRESS = 'localhost:8000'

const api = axios.create({
	baseURL: 'http://' + ADDRESS,
	headers: {
		'Content-Type': 'application/json'
	}
})

export default api