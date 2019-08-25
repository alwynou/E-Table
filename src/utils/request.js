import axios from "axios";

const server = axios.create({
    baseURL: '/api',
    timeout: 5000
})

server.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        return Promise.reject(error)
    }
)

export default server