import React, {useEffect, useState } from 'react'
import './css/PipeLineMnagement.css'
import axios from 'axios'
import address from '../../address_config'
import PipeLineListTable from './components/PipeLineListTable'
import dayjs from 'dayjs'
import CreatePipeLine from './components/CreatePipeLine'

const PipeLineMnagement = () => {

  const [pipeLineItems, setPipeLineItems] = useState([]);

  const [deptsList, setDeptsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [typesList, setTypesList] = useState([]);
  const [dateData, setDateData] = useState(dayjs().format("YYYY-MM-DD"));
  const [checkedValusId, setCheckedValusId] = useState([]);
  const [selectDept, setSelectDept] = useState('all');
  const [isDept, setIsDept] = useState(false)

  const [addView, setAddview] = useState(false);
  const [isChange, setIsChange] = useState(false);

  const [createData, setCreateData] = useState(
    {
      deptName: '',  // 본부
      customerName: '', // 고객
      typeName: '',  // 사업명
      state :'',
      contents: [],
      sales: '',
      purchase: '',
      profit: ''
    }
  );

  const [headquartersItems, setHeadquartersItems] = useState([{}])

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
      document.location.href = "/not"
    })
  }
    
  const setPipeLineItemsData = async() => {
    await axios.post(`http://${address.ip}:${address.port}/pipeline`, {date: dateData})
    .then((res) => {
      if(res.data.result == "FAIL"){
        console.log(res.data.msg)
      }
      else{
        setPipeLineItems(res.data.pipelineList)
      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
      console.log("pipeline list error")
    })
  }

  const setAdditionsItemsData = async() => {
    await axios.get(`http://${address.ip}:${address.port}/pipeline/additions`)
    .then((res) => {
      if(res.data.result == "FAIL"){
        console.log(res.data.msg)
      }
      else{
        setDeptsList(res.data.depts)
        setCustomersList(res.data.customers)
        setTypesList(res.data.types)
      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
      console.log("total list error")
    })
  }

  const deleteCheckCustomerItem = async() => {
    await axios.post(`http://${address.ip}:${address.port}/pipeline/deletes`, {pipelineIDs:checkedValusId})
    .then((res) => {
      if(res.data.result == "FAIL"){
        console.log(res.data.msg)
        alert("삭제 실패");
      }
      else{
        setPipeLineItemsData()
        setIsChange(!isChange)
      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
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

  const selectDeptHandler = (e) => {
    setSelectDept(e.target.value)
  }

  const setCreateDataHandler = (data) =>{
    setCreateData(data)
  }

  const onCreateView = () => {
    setAddview(!addView)
  }

  const onIsChangeData = () => {
    setIsChange(!isChange)
  }

  useEffect(()=>{
    document.getElementById('date').value = dayjs().format("YYYY-MM-DD");
    setPipeLineItemsData()
  }, [])

  useEffect(()=>{
    setPipeLineItemsData()
  },[dateData, isChange])

  useEffect(()=>{
    setPipeLineItemsData()
  },[isChange])

  useEffect(()=>{
    setAdditionsItemsData()
    setHeadquartersItemsData()
  },[])

  return (
    <div className='pipeLineMnagement-container'>
      <div>
            <div className='mainSession-title'>파이프라인 현황</div>
            <div className='mainSession-subtitle'>설명을 적어봅시다</div>
        </div>
      <div  className='pipeLineMnagement-container-button-box'>
        <button className='pipeLineMnagement-container-checkedDelte' onClick={()=>onCheckedDelete()}>선택 삭제</button>
        <button className='pipeLineMnagement-container-addButton' onClick={()=>setAddview(!addView)}>추가</button>
        <input  type="date" id='date' onChange={(e)=>setDateData(e.target.value)}/>
        <select className='pipeLineMnagement-container-dep-select' onChange={(e)=>selectDeptHandler(e)}>
          <option value={'all'}>전체</option>
          {
            headquartersItems.map((dep)=>(
              <option value={dep.deptName} >{dep.deptName}</option>
            ))
          }
        </select>
      </div>

      <div className='pipeLineMnagement-container-list-box' >
        <table cellSpacing="1">

        {
          addView ?
          ''
          :
          <thead className='pipeLineMnagement-container-list-head'>
            <tr>
              <th colSpan={1}>순번</th>
              <th colSpan={1}>현황</th>
              <th colSpan={1}>본부</th>
              <th colSpan={1}>고객사</th>
              <th colSpan={2}>사업명</th>
              <th colSpan={1}>작업</th>
            </tr>
          </thead>

        }

          <tbody className='pipeLineMnagement-container-list-item'>
        {
            addView ?
              <div className='pipeLineMnagement-container-add-container' >
                <CreatePipeLine
                  deptsList={deptsList}
                  customersList={customersList}
                  typesList={typesList}
                  onIsChangeData={onIsChangeData}
                  onCreateView={onCreateView}
                  setCreateDataHandler={setCreateDataHandler}
                  />
              </div>
            :
              <>
              {
                selectDept == 'all' ?
                  pipeLineItems.map((item, index)=>(
                    <PipeLineListTable
                      key={index} 
                      item={item} 
                      index={index} 
                      deptsList={deptsList}
                      customersList={customersList}
                      typesList={typesList}
                      isChange={isChange}
                      onIsChangeData={onIsChangeData}
                      settingTrueCheckdValusId={settingTrueCheckdValusId}
                      settingFalseCheckdValusId={settingFalseCheckdValusId}
                    />

                  ))
                  :
                  pipeLineItems.map((item, index)=>(
                    selectDept == item.deptName ?
                    <PipeLineListTable
                      key={index} 
                      item={item} 
                      index={index} 
                      deptsList={deptsList}
                      customersList={customersList}
                      typesList={typesList}
                      isChange={isChange}
                      onIsChangeData={onIsChangeData}
                      settingTrueCheckdValusId={settingTrueCheckdValusId}
                      settingFalseCheckdValusId={settingFalseCheckdValusId}
                    />
                    :
                    ''
                  ))
              }
              </>
        } 
          </tbody>
      
        </table>
      </div>
    </div>
  )
}

export default PipeLineMnagement