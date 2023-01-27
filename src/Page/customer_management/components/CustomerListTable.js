import React, {useEffect, useState } from 'react'
import '../css/CustomerListTable.css'

const CustomerListTable = ({item, index, onDelete, isChange, updateCustomerItem, settingTrueCheckdValusId, settingFalseCheckdValusId }) => {

  const [isUpate, setIsUpdate] = useState(false)
  const [newName, setNewName] = useState(item.customerName)


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

    onDelete(item.customerID, item.customerName);
    setIsUpdate(false)
  }


  const onUpdateView = () => {
    setNewName(item.customerName)
    setIsUpdate(!isUpate)
  }
  

  const onUpdate = () => {
    if(item.customerName == newName){
      alert("변경 사항이 없습니다.")
    }
    else if(newName == ''){
      alert("내용을 입력하세요")
    }
    else{
      
        updateCustomerItem({
            customerID: item.customerID,
            customerName: item.customerName,
            newCustomerName: newName
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
      settingTrueCheckdValusId(item.customerID)
    }
    else{
      settingFalseCheckdValusId(item.customerID)
    }
    
    target.checked = false

  },[isChange])

  return (
    <>
        <tr className="test" border="10">

            <label className='customerManagement-container-list-checkbox-label'>
                <td width='100' key={index}>
                    <input 
                        className='customerManagement-container-list-checkbox' 
                        id ={index}
                        type='checkbox' 
                        defaultValue={item.customerID}  
                        onClick={(e)=>onChecked(e)}
                    />
                    {index+1}
                </td>
            </label>

            <td align='center'>
                {item.customerName}
            </td>

            <td width='200' align='center'>
                <button className='customerManagement-container-list-item-update' onClick={()=> onUpdateView()}>수정</button>
                <button className='customerManagement-container-list-item-delete' onClick={(e)=> onDeleteSub(e)}>삭제</button>
            </td>

        </tr>
        {
            isUpate ?
            <tr className="test" border="10">

                <td width='100'/>

                <td align='center' className='customerManagement-container-list-item-update-td'>
                    <input type='text' defaultValue={newName} onChange={newNameHandler} onKeyDown={enterKeyUpdate} />
                    <button className='customerManagement-container-list-item-update-updateButton' onClick={()=> onUpdate()}>수정</button>
                    <button className='customerManagement-container-list-item-update-cencleButton' onClick={()=> onUpdateView()}>취소</button>
                </td>

                <td width='200'/>

            </tr>
            :
            ''
        }

    </>
  )
}

export default CustomerListTable