import React, {useEffect, useState } from 'react'
import HeadquarterListTable from './components/HeadquarterListTable'
import axios from 'axios'
import './css/HeadquartersManagement.css'
import address from '../../address_config'

const HeadquartersManagement = () => {

  const [headquartersItems, setHeadquartersItems] = useState([{}])

  const [checkedValusId, setCheckedValusId] = useState([])
  const [addView, setAddview] = useState(false)
  const [addData, setAddData] = useState("")
  const [isChange, setIsChange] = useState(true)

  const setHeadquartersItemsData = async() => {
    await axios.get(`http://${address.ip}:${address.port}/admin/dept`)
    .then((res) => {
      if(res.data.result == "FAIL"){
        console.log(res.data.msg)
      }
      else{
        setHeadquartersItems(res.data.deptList)
      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
      console.log("customer list error")
    })
  }

  const deleteHeadquartersItem = async(item) => {
    await axios.post(`http://${address.ip}:${address.port}/admin/dept/delete`, item)
    .then((res) => {
      if(res.data.result == "FAIL"){
        console.log(res.data.msg)
        alert("삭제 실패  파이프라인이 등록된 본부 또는 서버 오류");
      }
      else{
        setHeadquartersItemsData()
        setIsChange(!isChange)
      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
    })
  }

  const updateHeadquartersItem = async(item) => {
    await axios.post(`http://${address.ip}:${address.port}/admin/dept/modify`, item)
    .then((res) => {
      if(res.data.result == "FAIL"){
        console.log(res.data.msg)
        alert("수정 실패");
      }
      else{
        setHeadquartersItemsData()
      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
      document.location.href = "/not"
    })
  }

  
  const deleteCheckHeadquartersItem = async() => {
    await axios.post(`http://${address.ip}:${address.port}/admin/dept/deletes`, {deptIDs:checkedValusId})
    .then((res) => {
      if(res.data.result == "FAIL"){
        console.log(res.data.msg)
        alert("삭제 실패");
      }
      else{
        setHeadquartersItemsData()
        setIsChange(!isChange)
      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
    })
  }

  const createHeadquartersItem = async(item) => {
    await axios.post(`http://${address.ip}:${address.port}/admin/dept/create`, item)
    .then((res) => {
      if(res.data.result == "FAIL"){
        console.log(res.data.msg)
        alert("추가 실패");
      }
      else{
        setHeadquartersItemsData()
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
      alert("본부를 선택하세요")
    }
    else{
      let confrim = window.confirm( checkedValueLenght+ "개의 본부를 삭제하시겠습니까? ")

      if(confrim){
        deleteCheckHeadquartersItem()
        setCheckedValusId([])
      }

    }
  }

  const onDelete = (id, name) =>{
    let confrim = window.confirm("\"" + name + "\" 를 삭제하시겠습니까? ")

    if(confrim){
      deleteHeadquartersItem({deptID: id})
    }
  }

  const onCreate = () => {
    if(addData == ""){
      alert("데이터를 입력하세요")
    }
    else{ 
      let isSame = false;
      headquartersItems.map((item)=>(
        item.deptName == addData ?
          isSame = true : ''
      ))

      if(isSame){
        alert(addData +"는 이미 존재합니다.")
      }
      else{
        setAddview(!addView)
        createHeadquartersItem({deptName: addData})
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
    setHeadquartersItemsData()
  }, [])

  return (
    <div className='headquartersManagement-container'>
      <div>
            <div className='mainSession-title'>본부 현황</div>
            <div className='mainSession-subtitle'>설명을 적어봅시다</div>
        </div>
      <div  className='headquartersManagement-container-button-box'>
        <button className='headquartersManagement-container-checkedDelte' onClick={()=>onCheckedDelete()}>선택 삭제</button>
        <button className='headquartersManagement-container-addButton' onClick={()=>onAddView()}>추가</button>
        {
          addView ?
          <>
            <input className='headquartersManagement-container-addInput'  
              value={addData} 
              onChange={(e)=>setNewData(e)}
              onKeyDown={(e)=>{
                if(e.keyCode == 13){
                  onCreate()
                }
              }} 
              type='text' 
              placeholder='본부 명'
             />
            <button className='headquartersManagement-container-add-button' onClick={onCreate} >추가</button>
            <button className='headquartersManagement-container-cencle-button' onClick={()=>onAddView()}>취소</button>
          </>
          :
            ''
        } 

      </div>

      <div className='headquartersManagement-container-list-box' >
        <table cellSpacing="0" >
          <thead className='headquartersManagement-container-list-head'>
            <tr>
              <th width='100'>순번</th>
              <th>본부</th>
              <th>작업</th>
            </tr>
          </thead>

          <tbody className='headquartersManagement-container-list-item'>
            {
              headquartersItems.map((item, index)=>(
                <HeadquarterListTable 
                  key={index} 
                  item={item} 
                  index={index} 
                  isChange={isChange}
                  onDelete={onDelete} 
                  updateHeadquartersItem={updateHeadquartersItem}
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

export default HeadquartersManagement