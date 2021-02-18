import React, {useEffect, useState} from 'react'
import s from './PopUp.module.css'
import useEscape from "../../utils/useEscape";
import {animated, useSpring} from 'react-spring'

const PopUp = ({onClose=()=>{}, ...props}) => {

    const [unmounting, setUnmounting] = useState(false)

    const _onClose = () => {
        setUnmounting(true)
        setTimeout(()=>{
            onClose()
        }, 300)
    }

    const containerRef = useEscape(s.wrapper, _onClose);

    const fadeIn = useSpring({config: { duration: 250 }, opacity: Number(!unmounting), from: {opacity: Number(unmounting)}})
    const slideUp = useSpring({config: { duration: 250 }, marginBottom: Number(unmounting) * -100, from: {marginBottom: Number(!unmounting) * -100}})
    return <animated.div style={fadeIn} className={s.wrapper} ref={containerRef}>
        <animated.div style={slideUp}>
            {props.children}
        </animated.div>
    </animated.div>
}

export default PopUp
