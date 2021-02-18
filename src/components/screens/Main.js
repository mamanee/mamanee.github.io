import React, {useRef, useState, useEffect, useContext} from 'react'
import styles from './main.module.css'
import Div100vh from "react-div-100vh";
import {DAY, WEEK, MONTH, YEAR, PROFIT, INCOME, FORMAT, SPENT} from "../../data/DataContext";
import {rub} from "../../utils/utils";
import {DataContext} from "../../data/DataContext";
import moment from "moment";
import {useSpring, animated} from 'react-spring'
import useEscape from "../../utils/useEscape";
import preloader from '../../assets/preloader.svg'
import WeekView from "../WeekView/WeekView";

const Loading = () => {
    return <div className={styles.loading}><img src={preloader} width={20} height={20}/></div>
}
const Main = () => {
    const {addTransaction, days, getTotal, fetch, isFetching} = useContext(DataContext)
    useEffect(()=>{
        fetch()
    },[])

    return <Div100vh className={styles.wrapper}>
        {isFetching && <Loading/>}
        <div className={styles.mainGrid}>
            <Header/>
            <MonthOverview getTotal={getTotal}/>
            <div style={{height: "60px"}}/>
            <Footer/>
        </div>
    </Div100vh>
}

const Footer = () => {
    const container = useEscape(styles.animBackdrop, ()=>setModalShown(false))
    const [isModalShown, setModalShown] = useState(false)
    const popup = useSpring(isModalShown ? {bottom: 16} : {bottom: -200})
    const backdrop = useSpring(isModalShown ? {opacity: 1, pointerEvents: "all"} : {opacity: 0, pointerEvents: "none"})
    const button = useSpring(!isModalShown ? {bottom: 0} : {bottom: -60})
    return <>
        <animated.div style={backdrop} className={styles.animBackdrop} ref={container}/>
        <animated.div style={popup} className={styles.animWrapper}>{isModalShown && <AddCard onClose={() => setModalShown(false)}/>}</animated.div>
        <animated.div style={button} className={styles.animWrapper}><div className={styles.footer} onClick={()=>setModalShown(v=>!v)}>
        <i className={'fas fa-plus'}/><span>Add transaction</span>
        </div>
        </animated.div>
    </>
}
const Header = () => {
    return <div className={styles.header}>
        <div className={styles.title}>
        <b>Money</b>App
        </div>
    </div>
}

export const AddCard = ({onClose=()=>{}, date=moment().format(FORMAT)}) => {
    const input = useRef()
    const [value, setValue] = useState('')
    const {addTransaction} = useContext(DataContext)

    const onAddEarned = () => {
        if (value != '' && value != 0) {
            addTransaction(INCOME, parseFloat(value.toString()), '', date)
            onClose()
        }
        setValue('')
    }

    const onAddSpent = () => {
        if (value != '' && value != 0) {
            addTransaction(SPENT, parseFloat(value.toString()), '', date)
            onClose()
        }
        setValue('')
    }

    const onInputFocus = () => {
        if (input.current)
            input.current.focus()
    }

    return <div className={styles.cardWrapper}>
        <div className={styles.inputArea} onClick={onInputFocus}>
            <div className={styles.input}>
                <input value={value}
                       type={"number"}
                       ref={input}
                       autoFocus={true}
                       pattern={"[0-9]*"}
                       inputMode={"decimal"}
                       placeholder={'0'}
                       style={{width: 16*(value.toString().length+1)}}
                       onChange={(e)=>setValue(p=>e.target.value.length <=7 ? e.target.value : p)}
                       onFocus={()=>{value == 0 && setValue('')}}
                       onBlur={()=>{value == '' && setValue(0)}}
                />
                <span>₽</span>
            </div>
        </div>
        <div className={styles.buttons}>
            <Button className={styles.income} onClick={onAddEarned}><i className={'fas fa-plus'}/><span>Earned</span></Button>
            <Button className={styles.spent}  onClick={onAddSpent}><i className={'fas fa-minus'}/><span>Spent</span></Button>

        </div>
    </div>
}
export default Main

const Button = (props) => {
    return <button className={styles.button+' '+props?.className || ''} onClick={props.onClick} style={props.style}>
        {props.children}
    </button>
}

export const MonthOverview = ({getTotal, fixedMode=false, day}) => {
    const [mode, setMode] = useState(fixedMode === false ? WEEK : fixedMode)
    const [values, setValues] = useState({earned: 0, spent: 0, profit: 0})
    const {days} = useContext(DataContext)


    const _date = day || moment().format(FORMAT)
    useEffect(()=>{
        setValues({
            earned: getTotal(mode, INCOME, _date),
            spent: getTotal(mode, SPENT, _date),
            profit: getTotal(mode, PROFIT, _date),
        })
        console.log('render')
    },[mode, days])

    return <>{fixedMode === false && <div className={styles.modeSelector}>
        <Button className={styles.mode}
                style={{backgroundColor: mode === DAY ? '#00AFB9' : '#efefef', color: mode === DAY ? 'white' : 'black'}}
                onClick={() => setMode(DAY)}>Day</Button>
        <Button className={styles.mode} style={{
            backgroundColor: mode === WEEK ? '#00AFB9' : '#efefef',
            color: mode === WEEK ? 'white' : 'black'
        }} onClick={() => setMode(WEEK)}>Week</Button>
        <Button className={styles.mode} style={{
            backgroundColor: mode === MONTH ? '#00AFB9' : '#efefef',
            color: mode === MONTH ? 'white' : 'black'
        }} onClick={() => setMode(MONTH)}>Month</Button>
        <Button className={styles.mode} style={{
            backgroundColor: mode === YEAR ? '#00AFB9' : '#efefef',
            color: mode === YEAR ? 'white' : 'black'
        }} onClick={() => setMode(YEAR)}>Year</Button>
    </div>}
    <div className={styles.monthWrapper}>
        <div className={styles.monthItem+' '+styles.monthIncome}>
            <div className={styles.monthLabel}>Earned</div>
            <div className={styles.monthAmount}>{rub(values.earned)}</div>
        </div>
        <div className={styles.monthItem+' '+styles.monthSpent}>
            <div className={styles.monthLabel}>Spent</div>
            <div className={styles.monthAmount}>{rub(values.spent)}</div>
        </div>
        <div className={styles.monthItem+' '+styles.monthProfit}>
            <div className={styles.monthLabel}>Profit</div>
            <div className={styles.monthAmount}>{rub(values.profit)}</div>
        </div>
    </div>
        {mode === DAY && <DayView day={day}/>}
        {mode === WEEK && <WeekView day={day}/>}
    </>
}

export const DayView = ({day = moment().format(FORMAT)}) => {
    const {getHistory, days, deleteTransaction} = useContext(DataContext)
    const [history, setHistory] = useState([])
    useEffect(()=>{
        setHistory(getHistory(day))
    }, [day, days])

    if (history.length === 0) return <div className={styles.noData}>
        No data tracked for this day.
    </div>
    return <div className={styles.dayViewArea}>

    <div className={styles.dayView}>
{/*
        <div className={styles.historyTitle}>{day === moment().format(FORMAT) ? 'Today\'s history:' : 'History of '+day.replaceAll('-','.')}</div>
*/}
        {history.map(({type, amount, comment}, index)=><HistoryItem comment={comment} amount={amount} type={type} id={index} key={index} onDelete={()=>{deleteTransaction(day, index)}}  isLast={index == history.length-1}/>)}
    </div>
    </div>
}
const HistoryItem = ({type = INCOME, amount = 0, comment = '', onDelete=()=>{}, isLast = false}) => {
    return <div className={styles.itemWrapper} style={isLast ? {borderBottom: 'none'} : {}}>
        <div className={styles.itemValue} style={type === INCOME ? {color: '#00AFB9'} : {color: '#F07167'}}>{['+ ','- '][type]}{rub(amount)}</div>
        <div className={styles.itemButtons} onClick={onDelete}><i className={'fas fa-times'}/></div>
        {comment && <div className={styles.itemComment}>{comment}</div>}
    </div>
}
