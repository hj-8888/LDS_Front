import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Menu from './components/Menu'
import './css/SideBar.css'

const SideBar = ({changPageNum, menuArr}) => {

  const onChangePage = (data) => {
    changPageNum(data)
  }

  return (
    <div className='sideBar-container'>
      <div className='sideBar-home-menu' onClick={()=>{onChangePage(0)}}>
        <img className='sideBar-home-icon'src='https://www.linuxdata.co.kr/sub/img/logo_new.png'></img>
        <span className='sideBar-home-title'>통합 영업 관리 시스템</span>
      </div>

      <div className='sideBar-menus-box'>
        {
          menuArr.map((i, index)=>(
            <Menu key={index} title={i.headMenu} subMenu={i.subMenu} onChangePage={onChangePage} />
          ))
        }
      </div>
    </div>
  )
}

export default SideBar