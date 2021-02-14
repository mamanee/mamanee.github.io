import React, {useState} from 'react'
import {Enum} from "../utils/utils";
import moment from "moment";
import {fetchData, setData} from "../api/API";

export const [DAY, WEEK, MONTH, YEAR, ALL] = Enum(5)
export const [INCOME, SPENT, PROFIT] = Enum(3)

export const FORMAT = "DD-MM-YYYY"


const getDays = (date, interval = DAY) => { //date: "DD-MM-YYY"
    let unitOfTime = "day"
    switch (interval) {
        case DAY:
            unitOfTime = "day"
            break
        case WEEK:
            unitOfTime = "isoWeek"
            break
        case MONTH:
            unitOfTime = "month"
            break
        case YEAR:
            unitOfTime = "year"
            break
    }
    const _date = moment(date, FORMAT)
    const _Start = _date.clone().startOf(unitOfTime)
    const _End = _date.clone().endOf(unitOfTime)

    let days = [];
    let day = _Start;

    while (day <= _End) {
        days.push(moment(day, FORMAT).format(FORMAT));
        day = day.clone().add(1, 'd');
    }
    return days // ["DD-MM-YYYY"]
}
const contextShape = {
    days: {},
    getTotal: (interval = ALL, type = INCOME, date = '01-01-2021')=>0,
    addTransaction: (day = '01-01-2021', type = INCOME, amount = 0, comment = '')=>{},
    getHistory: (day = '01-01-2021') => []
}
export const DataContext = React.createContext(contextShape)

/*export const useDataContext = () => {

    const [userData, setUserData] = useState(contextShape)

    useEffect(()=>{
        setUserData(new User(contextShape.days))
    },[])
    debugger


    return userData
}*/

export const useDataContext = () => {
    const [days, setDays] = useState({})
    const [isFetching, setFetching] = useState(false)

    const getTotal = (interval = ALL, type = INCOME, date = '01-01-2021') => {
        const possibleDays = interval === ALL ? Object.keys(days) : getDays(date, interval)
        return possibleDays.reduce((accum, currentKey) => {
            if (days?.[currentKey]) {
                const day = days[currentKey]
                switch (type) {
                    case INCOME:
                        return accum + (day.income || 0)
                    case SPENT:
                        return accum + (day.spent || 0)
                    case PROFIT:
                        return accum + ((day.income || 0) - (day.spent || 0))
                }
            } else
                return accum
        }, 0)
    }
    const addTransaction = async (type = INCOME, amount = 0, comment = '', day=moment().format(FORMAT))=>{
        const newDays = {
            ...days,
            [day]: {
                ...days?.[day],
                income: (days?.[day]?.income || 0) + amount*Number(type === INCOME),
                spent:  (days?.[day]?.spent || 0) + amount*Number(type === SPENT),
                history: [
                    ...(days?.[day]?.history || []),
                    {
                        type: type,
                        amount: amount,
                        comment: comment
                    },
                ],
            },
        }
        setDays(newDays)
        return await pushDays(false, newDays)
    }

    const getHistory = (day) => {
        return days[day]?.history || []
    }

    const deleteTransaction = async (day=moment().format(FORMAT), index=-1) => {
        const _transaction = days?.[day]?.history?.[index] || {amount: 0, type: INCOME}

        const newDays = {
            ...days,
            [day]: {
                ...days?.[day],
                income: days?.[day]?.income - (_transaction.amount * Number(_transaction.type === INCOME)),
                spent: days?.[day]?.spent - (_transaction.amount * Number(_transaction.type === SPENT)),
                history: [
                    ...(days?.[day]?.history || []).filter((_,i)=> i !== index),
                ]
            }
        }
        setDays(newDays)
        return await pushDays(false, newDays)
    }

    const pushDays = async (isNewUser=false, payload) => {
        setFetching(true)
        const user = localStorage.getItem('userId')
        const _user = isNewUser ? false : (user || false)
            const res =  await setData(_user, payload || days)
        setFetching(false)
        return res
    }
    const fetch = async () => {
        setFetching(true)
        const user = localStorage.getItem('userId')
        const data = await fetchData(user)
        if (!data) {
           const resp =  await pushDays(true)
            resp?.name && localStorage.setItem('userId', resp.name)

        }
        else {
            setDays(data)
        }
        setFetching(false)
    }
    return {days, addTransaction, getTotal, deleteTransaction, getHistory, fetch, isFetching}
}
