import React, { useState } from 'react'
import '../css/Menu.css'
import MenuItem from './MenuItem'


const Menu = ({title, subMenu, onChangePage, num}) => {
  const [pipelineMenuView, setPipelineMenuView] = useState(false);
  
  const onMenuClink = () => {
    setPipelineMenuView(!pipelineMenuView);
  }

  const onChanges = (data) => {
    onChangePage(data)
  }


  return (
    <ul className='sideBar-menus-list'>
      <div className='menuTitle' onClick={onMenuClink}>

        <span className='menuTitle-title'>
          {pipelineMenuView ? 'v ' : '>'}
          {title}
        </span>

      </div>
      {
        pipelineMenuView &&
        <>
          {
            subMenu.map( (m, index) => 
              <li key={index} className='sideBar-menus-item'>
                <MenuItem title={m} onChanges={onChanges} inum={num}/>
              </li>
            )
          }
        </>
      }
    </ul>
  )
}

export default Menu