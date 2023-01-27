import React from 'react'
import '../css/MenuItem.css'

const MenuItem = ({title, onChanges}) => {


  const click = () => {

    let str = title;

    if(str === "고객 현황"){
      onChanges(1)
    }
    else if(str === "본부 현황"){
      onChanges(2)
    }
    else if(str === "파이프라인 현황"){
      onChanges(3)
    }
  }
  
  return (
    <div className='menuItem' onClick={click}>
      <span className='menuItem_title'>
          {title}
      </span>
  </div>
  )
}

export default MenuItem