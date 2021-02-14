import React, {useState} from 'react'
import {fetchData, setData} from "../api/API";

export const useAPI = () => {
    // returns 2 getters 1 loader
    const [isWaiting, setWaiting] = useState(false)

    const fetchUser = async (user) => {
        setWaiting(true)
        const result = await fetchData(user)
        setWaiting(false)
        return result
    }
    const setUser = async (user, data) => {
        setWaiting(true)
        const result = await setData(user, data)
        setWaiting(false)
        return result
    }
    return {fetchUser, setUser, isWaiting}
}
