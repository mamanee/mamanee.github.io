import moment from "moment";
import {DataContext, DAY, FORMAT, PROFIT, WEEK} from "../../data/DataContext";
import React, {useContext, useState} from "react";
import styles from "./week.module.css";
import {AddCard, DayView, MonthOverview} from "../screens/Main";
import PopUp from "../common/PopUp";
import {rub} from "../../utils/utils";

const WeekView = ({day = moment().format(FORMAT)}) => {
    const {getDaysOfRange, getTotal} = useContext(DataContext)
    const [dayDetails, setDayDetails] = useState(false)
    const days = getDaysOfRange(day, WEEK)
    return <div className={styles.weekViewWrapper}>
        {dayDetails && <PopUp onClose={()=>setDayDetails(false)}><DayDetails date={dayDetails}/></PopUp>}
        {days.map((date, index)=>{
            return <WeekDay date={moment(date, FORMAT).format('DD')}
                            fulldate={date}
                            weekday={moment(date, FORMAT).format('ddd')}
                            profit={getTotal(DAY, PROFIT, date)}
                            onClick={()=>setDayDetails(date)}
                            isLast={index === days.length-1}
                            key={index}
            />
        })}
    </div>

}

const DayDetails = ({date}) => {
    const [isAddModalShown, setAddModalShown] = useState(false)
    const {getTotal} = useContext(DataContext)
    return <div className={styles.dayDetailsWrapper}>
        <div className={styles.dayDetailsTitle}>{moment(date, FORMAT).format('dddd DD.MM')}</div>
        <MonthOverview fixedMode={DAY} getTotal={getTotal} day={date}/>
    {/*<DayView day={date}/>*/}
        {isAddModalShown && <PopUp zIndex={1100} onClose={()=>setAddModalShown(false)}><AddCard date={date} onClose={()=>setAddModalShown(false)}/></PopUp>}
    <div className={styles.buttonArea}>
        <div className={styles.addButton} onClick={()=>setAddModalShown(true)}>
            <i className={'fas fa-plus'}/><span>Add transaction for this day</span>
        </div>
    </div>
    </div>
    }

const WeekDay = ({date, weekday, profit, onClick = () => {}, isLast = false, fulldate}) => {

    return <div className={styles.weekDayWrapper} style={isLast ? {border: 'none'} : {}} onClick={onClick}>
        <div className={styles.weekDayName} style={fulldate==moment().format(FORMAT) ? {color: '#F07167'} : {}}>{weekday}</div>
        <div className={styles.weekDayDate} style={fulldate==moment().format(FORMAT) ? {color: '#F07167'} : {}}>{date}</div>
        <div className={styles.weekDayProfit} style={{color: profit >= 0 ? '#0081A7' : '#F07167'}}>{profit !== undefined ? ((profit > 0 ? '+' : '') + rub(profit)): ''}</div>
    </div>
}

export default WeekView
