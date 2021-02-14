import _axios from "axios";
const axios = _axios.create({
    baseURL: "https://smart-money-c44ee-default-rtdb.firebaseio.com/",
    withCredentials: false
})

export const fetchData = (user) => axios.get(`/db/${user}.json`).then(r=>r.data)

export const setData = (user, data) => {
    if (user) {
        return axios.put(`/db/${user}.json`, data).then(r=>r.data)
    } else {
        return axios.post('db.json', data).then(r=>r.data)
    }
}
