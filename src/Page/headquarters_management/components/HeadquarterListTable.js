import React, {useEffect, useState } from 'react'
import axios from 'axios'
import '../css/HeadquarterListTable.css'

const HeadquarterListTable = ({item, index, onDelete, isChange, updateHeadquartersItem, settingTrueCheckdValusId, settingFalseCheckdValusId }) => {

  const [isUpate, setIsUpdate] = useState(false)
  const [newName, setNewName] = useState(item.deptName)

  const onChecked = (e) => {
    let targetValue = e.target.defaultValue;
    if(e.target.checked){
        settingTrueCheckdValusId(targetValue)
    }
    else{
      settingFalseCheckdValusId(targetValue)
    }
  }

  const onDeleteSub = () => {
    document.getElementById(index).click()

    onDelete(item.deptID, item.deptName);
    setIsUpdate(false);
  }

  const onUpdateView = () => {
    setNewName(item.deptName)
    setIsUpdate(!isUpate)
  }

  const onUpdate = () => {
    if(item.deptName == newName){
        alert("변경 사항이 없습니다.")
    }
    else if(newName == ''){
      alert("내용을 입력하세요")
    }
    else{
      updateHeadquartersItem({
          deptID: item.deptID,
          deptName: item.deptName,
          newDeptName: newName
      })
        onUpdateView()
    }
  }

  const newNameHandler = (e) => {
    setNewName(e.target.value)
  }

  const enterKeyUpdate = (e) => {
    if(e.keyCode == 13){
      onUpdate()
    }
  }

  useEffect(()=>{
    let target = document.getElementById(index)
    
    
    if(target.checked){
      settingTrueCheckdValusId(item.deptID)
    }
    else{
      settingFalseCheckdValusId(item.deptID)
    }
    
    target.checked = false

  },[isChange])

  return (
    <>
        <tr className="test" border="10">

            <label className='headquartersManagement-container-list-checkbox-label'>
                <td width='100' key={index}>
                    <input 
                        className='headquartersManagement-container-list-checkbox' 
                        id ={index}
                        type='checkbox' 
                        defaultValue={item.deptID}  
                        onClick={(e)=>onChecked(e)}
                    />
                    {index+1}
                </td>
            </label>

            <td align='center'>
                {item.deptName}
            </td>

            <td width='200' align='center'>
                <button className='headquartersManagement-container-list-item-update' onClick={()=> onUpdateView()}>수정</button>
                <button className='headquartersManagement-container-list-item-delete' onClick={()=> onDeleteSub()}>삭제</button>
            </td>

        </tr>
        {
            isUpate ?
            <tr className="test" border="10">

                <td width='100'/>

                <td align='center' className='headquartersManagement-container-list-item-update-td'>
                    <input type='text' defaultValue={newName} onChange={newNameHandler} onKeyDown={enterKeyUpdate} required/>
                    <button className='headquartersManagement-container-list-item-update-updateButton' onClick={()=> onUpdate()}>수정</button>
                    <button className='headquartersManagement-container-list-item-update-cencleButton' onClick={()=> onUpdateView()}>취소</button>
                </td>

                <td width='200'/>

            </tr>
            :
            ''
        }

    </>
  )
}

export default HeadquarterListTable