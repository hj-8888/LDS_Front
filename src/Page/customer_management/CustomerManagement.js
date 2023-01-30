import React, {useEffect, useState } from 'react'
import CustomerListTable from './components/CustomerListTable'
import axios from 'axios'
import './css/CustomerManagement.css'
import address from '../../address_config'

const CustomerManagement = () => {

  const [customerItems, setCustomerItems] = useState([])
  const [checkedValusId, setCheckedValusId] = useState([])
  const [addView, setAddview] = useState(false)
  const [addData, setAddData] = useState("")
  const [isChange, setIsChange] = useState(true)

  const setCustomerItemsData = async() => {
    await axios.get(`http://${address.ip}:${address.port}/admin/customer`)
    .then((res) => {
      if(res.data.result == "FAIL"){
        alert("customer list error")
      }
      else{
        setCustomerItems(res.data.customerList)
      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
      alert("customer list error")
    })
  }

  const deleteCustomerItem = async(item) => {
    await axios.post(`http://${address.ip}:${address.port}/admin/customer/delete`, item)
    .then((res) => {
      if(res.data.result == "FAIL"){
        console.log(res.data.msg)
        alert("삭제 실패");
      }
      else{
        setCustomerItemsData()
        setIsChange(!isChange)
      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
    })
  }

  const updateCustomerItem = async(item) => {
    await axios.post(`http://${address.ip}:${address.port}/admin/customer/modify`, item)
    .then((res) => {
      if(res.data.result == "FAIL"){
        console.log(res.data.msg)
        alert("수정 실패");
      }
      else{
        setCustomerItemsData()
      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
      document.location.href = "/not"
    })
  }

  const deleteCheckCustomerItem = async() => {
    await axios.post(`http://${address.ip}:${address.port}/admin/customer/deletes`, {customerIDs:checkedValusId})
    .then((res) => {
      if(res.data.result == "FAIL"){
        console.log(res.data.msg)
        alert("삭제 실패");
      }
      else{
        setCustomerItemsData()
        setIsChange(!isChange)
      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
    })
  }

  const createCustomerItem = async(item) => {
    await axios.post(`http://${address.ip}:${address.port}/admin/customer/create`, item)
    .then((res) => {
      if(res.data.result == "FAIL"){
        console.log(res.data.msg)
        alert("추가 실패");
      }
      else{
        setCustomerItemsData();
      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
      document.location.href = "/not"
    })
  }

  const settingTrueCheckdValusId = (checkedArr) => {
    setCheckedValusId([...checkedValusId, checkedArr])
  }

  const settingFalseCheckdValusId = (checkedArr) => {
    const newData = checkedValusId.filter((i) => i !== checkedArr)
    setCheckedValusId(newData)
  }

  const onCheckedDelete = () => {
    let checkedValueLenght = checkedValusId.length;
    if(checkedValueLenght == 0){
      alert("고객사를 선택하세요")
    }
    else{
      let confrim = window.confirm( checkedValueLenght+ "개의 고객사를 삭제하시겠습니까? ")

      if(confrim){
        deleteCheckCustomerItem()
        setCheckedValusId([])
      }

    }
  }

  const onDelete = (id, name) =>{
    let confrim = window.confirm("\"" + name + "\" 고객사를 삭제하시겠습니까? ")
    if(confrim){
      deleteCustomerItem({customerID: id})
    }
  }

  const onCreate = () => {
    if(addData == ""){
      alert("데이터를 입력하세요")
    }
    else{
      let isSame = false;
      customerItems.map((item)=>{
        if(item.customerName == addData){
          isSame = true
        }
      })

      if(isSame){
        alert(addData +"는 이미 존재합니다.")
      }
      else{
        setAddview(!addView)
        createCustomerItem({customerName: addData})
      }
    }

  }

  const onAddView = () => {
    setAddData("")
    setAddview(!addView)
  }

  const setNewData = (e) => {
    setAddData(e.target.value)
  }

  useEffect(()=>{
    setCustomerItemsData()
  }, [])


  return (
    <div className='customerManagement-container'>
      <div>
            <div className='mainSession-title'>고객 현황</div>
            <div className='mainSession-subtitle'>설명을 적어봅시다</div>
      </div>
      <div  className='customerManagement-container-button-box'>
      <button className='customerManagement-container-checkedDelte' onClick={()=>onCheckedDelete()}>선택 삭제</button>
        <button className='customerManagement-container-addButton' onClick={()=>onAddView()}>추가</button>
        {
          addView ?
          <>
            <input className='customerManagement-container-addInput'  
              value={addData} 
              onKeyDown={(e)=>{
                if(e.keyCode == 13){
                  onCreate()
                }
              }} 
              onChange={(e)=>setNewData(e)} 
              type='text'
              placeholder='고객사 명'
             />
            <button className='customerManagement-container-add-button' onClick={onCreate} >추가</button>
            <button className='customerManagement-container-cencle-button' onClick={()=>onAddView()}>취소</button>
          </>
          :
            ''
        } 
      </div>

      <div className='customerManagement-container-list-box' >
        <table cellSpacing="1" >
          <thead className='customerManagement-container-list-head'>
            <tr>
              <th width='100'>순번</th>
              <th>고객사</th>
              <th>작업</th>
            </tr>
          </thead>

          <tbody className='customerManagement-container-list-item'>
            {
              customerItems.map((item, index)=>(
                <CustomerListTable 
                  key={index} 
                  item={item} 
                  index={index} 
                  isChange={isChange}
                  onDelete={onDelete} 
                  updateCustomerItem={updateCustomerItem}
                  settingTrueCheckdValusId={settingTrueCheckdValusId} 
                  settingFalseCheckdValusId={settingFalseCheckdValusId}
                />
              ))
            }
          </tbody>
      
        </table>
      </div>
    </div>
  )
}

export default CustomerManagement