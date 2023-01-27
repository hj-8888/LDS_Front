import React, {useEffect, useState } from 'react'
import axios from 'axios'
import address from '../../../address_config'
import '../css/PipeLineListTable.css'

const PipeLineListTable = ({ deptsList, customersList, typesList, item,  isChange, onIsChangeData, index, settingTrueCheckdValusId, settingFalseCheckdValusId }) => {

  const [isSelectView, setIsSelectView] = useState(false)
  const [isUpdateView, setIsUpdateView] = useState(false)

  const [contentData, setContentData] = useState([])

  const [pipeLineData, setPipeLineData] = useState()

  const [newPipeLineData, setNewPipeLineData] = useState([])

  const [color, setColor] = useState('none');
  const [font, setfont] = useState('none')


  // input 데이터 제어
  const pipeLineDataChangeHandler = (e) => {
    let targetName = e.target.name;
    let targetValue = e.target.value.replace(/,/g, "");
    
    let isStr = true
    if(targetName == 'expectedSales' || targetName == 'expectedPurchase' || targetName === 'expectedProfit'){
      targetValue = targetValue.replace(/\,/g, '')
      if(!isFinite(targetValue)){
        alert("숫자만 입력 가능합니다.")
        isStr = false
      }
    }
        
    if(isStr){
      setNewPipeLineData({
        ...newPipeLineData,
        [targetName] : targetValue,
      });
    }

  }

  const setPipeLineUpdateData = async() => {
    await axios.get(`http://${address.ip}:${address.port}/pipeline/${item.pipelineID}`)
    .then((res) => {
      if(res.data.result == "FAIL"){
        console.log(res.data.msg)
      }
      else{
        let pData = res.data.pipeline[0];
        let cData = res.data.content;

        setPipeLineData({
          ['pipelineID']: pData.pipelineID,
          ['deptName']: pData.deptName,
          ['customerName']: pData.customerName,
          ['typeName']: pData.typeName,
          ['title']: pData.title,
          ['date']: pData.date,
          ['expectedSales']: pData.expectedSales,
          ['expectedPurchase']: pData.expectedPurchase,
          ['expectedProfit']: pData.expectedProfit,
          ['contents']: cData
        })

        setNewPipeLineData({
          ['deptID']: '',
          ['customerID']: '',
          ['typeID']: '',
          ['title']: pData.title,
          ['date']: pData.date,
          ['expectedSales']: pData.expectedSales,
          ['expectedPurchase']: pData.expectedPurchase,
          ['expectedProfit']: pData.expectedProfit,
          ['contents']: cData
        })

        setContentData(cData)

      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
      console.log("pipeline list error")
    })
  }

  const pipeLineUpdate = async() => {
    await axios.post(`http://${address.ip}:${address.port}/pipeline/modify/${item.pipelineID}`, newPipeLineData)
    .then((res) => {
      if(res.data.result == "FAIL"){
        console.log(res.data.msg)
      }
      else{
        console.log(newPipeLineData)
      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
    })
  }

  const pipeLineDelte = async() => {
    await axios.post(`http://${address.ip}:${address.port}/pipeline/delete/${item.pipelineID}`)
    .then((res) => {
      if(res.data.result == "FAIL"){
        alert("삭제 실패")
        console.log(res.data.msg)
      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
    })
  
  }

  const settingContentData = (contents) => {
    
    let data = []

    if(contents.length == 0){
      data.push(
        {
          index: '',
          font: '',
          color: '',
          content: ''
        }
      )
    }else{
      contents.map((v, index)=>(
        data.push(
          {
            index: index,
            font: v.font,
            color: v.color,
            content: v.content
          }
        )
      ))
    }
    
    setContentData(data)
  }


  const contentDataHandler = (e, index) => {
    const findIndex = contentData.findIndex(v => v.index == index);
    let copyArray = [...contentData];

    if(findIndex != -1){
      copyArray[findIndex].content = e.target.value;
    }

    setContentData(copyArray);
    
    setNewPipeLineData({
      ...newPipeLineData,
      ['contents'] : contentData,
    });

  }

  const contentSyleHandler = (index) => {
    const findIndex = contentData.findIndex(v => v.index == index);

    let copyArray = [...contentData];


    if(findIndex != -1){
      if(color != 'none'){
        copyArray[findIndex].color = color;
      }
      if(font != 'none'){
        copyArray[findIndex].font = font;
      }
    }
    setContentData(copyArray);
    newPipeLineData.contents = copyArray
    resetStyleData()
  }

  const onChecked = (e) => {
    e.stopPropagation();
    let targetValue = e.target.defaultValue;
    if(e.target.checked){
      settingTrueCheckdValusId(targetValue)
    }
    else{
      settingFalseCheckdValusId(targetValue)
    }
  }

  const onDeleteSub = () => {
    let confirm = window.confirm("삭제 하시겠습니까?")
    if(confirm){
      pipeLineDelte();
      onIsChangeData();
      setIsSelectView(false);
      setIsUpdateView(false);
    }
  }

  const onUpdateView = () =>{
    setIsUpdateView(true)
    settingContentData(newPipeLineData.contents)
    setPipeLineData(newPipeLineData)
    defaultIdSetting()
  }

  const onSelectView = () => {
    setPipeLineUpdateData()
    setIsSelectView(!isSelectView)
    setIsUpdateView(false)
    settingContentData(newPipeLineData.contents)
  }

  const cencleUpdate = () => {
    setNewPipeLineData(pipeLineData)
    setContentData(pipeLineData.contents)
    setIsSelectView(!isSelectView)
    resetStyleData()
  }

   // 숫자 출력 형식 변경
   const setNumForm = (num) => {
    let targetValue = String(num);
    targetValue = targetValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return targetValue;
  }

  const defaultIdSetting = () => {

    let targetD = ''
    let targetC = ''
    let targetT = ''
    deptsList.forEach((v) =>{
      if(v.deptName == item.deptName){
        targetD = v.deptID
      }
    })

    customersList.forEach((v) =>{
      if(v.customerName == item.customerName){
        targetC = v.customerID
      }
    })

    typesList.forEach((v) =>{
      if(v.typeName == item.typeName){
        targetT = v.typeID
      }
    })

    setNewPipeLineData({
      ...newPipeLineData,
      ['deptID'] : targetD,
      ['customerID'] : targetC,
      ['typeID'] : targetT,
    });

  }
  
  const onAddTextFile = (e, index) => {

    if(e.keyCode == 13){
      newPipeLineData.contents.splice(index+1, 0, 
        {
          font:'',
          color:'',
          content:''
        }
      )
    }
    else if(e.keyCode == 8){
      try{
        const findIndex = contentData.findIndex(v => v.index == index);
        let isEmpty = newPipeLineData.contents[findIndex].content == "";
      
        if(isEmpty){
          newPipeLineData.contents.splice(index, 1)
        }

      }
      catch{
      }      
    }

    settingContentData(newPipeLineData.contents)

  }

  const onUpdate = () => {
    let confirm = window.confirm("수정 하시겠습니까?")
    
    if(confirm){

      if(newPipeLineData.expectedSales == ''){
        newPipeLineData.expectedSales = 0;
      }

      if(newPipeLineData.expectedPurchase == ''){
        newPipeLineData.expectedPurchase = 0;
      }

      pipeLineUpdate();
      onSelectView();
      onIsChangeData();
    }
  }

  const resetStyleData = () => {
    setColor('none')
    setfont('none')
  }

  useEffect(()=>{
    setPipeLineUpdateData()
  },[])

  useEffect(()=>{
    let target = document.getElementById(index)
    
    
    if(target.checked){
      settingTrueCheckdValusId(item.pipelineID)
    }
    else{
      settingFalseCheckdValusId(item.pipelineID)
    }
    
    target.checked = false

  },[isChange])

  useEffect(()=>{
    let profit = newPipeLineData.expectedSales - newPipeLineData.expectedPurchase;
    setNewPipeLineData({
      ...newPipeLineData,
      ['expectedProfit'] : profit,
    });
  },[newPipeLineData.expectedSales, newPipeLineData.expectedPurchase])

  return (
    <>
            <tr className='pipeLineMnagement-container-lists'>

              <label className='pipeLineMnagement-container-list-checkbox-label' >
                <td colSpan={1} align='center' >
                  <input 
                      className='pipeLineMnagement-container-list-checkbox' 
                      id ={index}
                      type='checkbox' 
                      defaultValue={item.pipelineID}  
                      onClick={(e)=>onChecked(e)}
                  />
                    {index+1}
                </td>
              </label>

              <td  colSpan={1} align='center' width='150px'>
                {item.typeName}
              </td>

              <td  colSpan={1} align='center' width='150px'>
                  {item.deptName}
              </td>

              <td colSpan={1} align='center' width='150px'>
                  {item.customerName}
              </td>

              <td colSpan={2} align='center' width='200px'>
                  {item.title}
              </td>

              <td colSpan={1} align='center'>
                  <button className='pipeLineMnagement-container-list-item-update' onClick={()=> onSelectView()}>조회</button>
                  <button className='pipeLineMnagement-container-list-item-delete' onClick={()=> onDeleteSub()}>삭제</button>
              </td>
            </tr>
          
        {
            isSelectView ?
            <>
              <tr className='pipeLineMnagement-container-list-item-contents-header' align='center' >

                <td  colSpan={1} width="10%"> 
                  <th>현황</th>
                </td>

                <td  colSpan={1} width="5%"> 
                  <th>본부</th>
                </td>

                <td  colSpan={1} width="10%"> 
                  <th>고객사</th>
                </td>

                <td colSpan={1} width="20%"> 
                  <th >사업명</th>
                </td>
                  
                <td colSpan={3} width="40%"> 
                  <th>내용</th>
                </td>

              </tr>
              
              {
                isUpdateView ?
                <>
                  <tr className='pipeLineMnagement-container-list-item-update-contents'>
                    
                    <td  colSpan={1} > 
                      <select name={'typeID'} onChange={pipeLineDataChangeHandler}>
                        {
                          typesList.map((v)=>(
                            v.typeName == item.typeName ?
                            <option value={v.typeID} selected>{v.typeName}</option>
                            :
                            <option value={v.typeID}>{v.typeName}</option>
                          ))
                        }
                      </select>
                    </td>

                    <td  colSpan={1} > 
                      <select name={'deptID'} onChange={pipeLineDataChangeHandler}>
                        {
                          deptsList.map((v)=>(

                            v.deptName == item.deptName ?
                              <option value={v.deptID} selected>{v.deptName}</option>
                              :
                              <option value={v.deptID}>{v.deptName}</option>

                          ))
                        }
                      </select>
                    </td>

                    <td  colSpan={1}  >
                      <select name={'customerID'} onChange={pipeLineDataChangeHandler}>
                        {
                          customersList.map((v)=>(
                            
                            v.customerName == item.customerName ?
                              <option value={v.customerID} selected>{v.customerName}</option>
                              :
                              <option value={v.customerID}>{v.customerName}</option>

                          ))
                        }
                      </select>
                    </td>

                    <td colSpan={1}> 
                      <input className='pipeLineMnagement-container-list-item-update-content' name={'title'} type='text' value={newPipeLineData.title} onChange={pipeLineDataChangeHandler} /> 
                    </td>
                      

                      {/* value style line  */}
                    <td className='pipeLineMnagement-container-list-item-update-content-tag' colSpan={4}> 
                    {
                     contentData.map((v, index) => (
                        <div className='textFile-box'>
                          <input 
                            className='textFild-input' 
                            type='text' 
                            style={{fontWeight:v.font, color:v.color}} 
                            value={v.content} 
                            onKeyDown={(e) => onAddTextFile(e, index)}
                            onChange={(e)=> contentDataHandler(e, index)}
                            onClick={()=> contentSyleHandler(index) }
                          />
                        </div>
                      ))
                    }
                      <button className='textFild-color-button' style={{backgroundColor:'black'}} onClick={()=>setColor("black")}></button>
                      <button className='textFild-color-button' style={{backgroundColor:'blue'}} onClick={()=>setColor("blue")}></button>
                      <button className='textFild-color-button' style={{backgroundColor:'red'}} onClick={()=>setColor("red")}></button>
                      <button className='textFild-font-button' onClick={()=>setfont("bold")} >🧪</button>
                      <button className='textFild-font-button' onClick={()=>setfont("normal")} >🗞</button>
                    </td>

                  </tr>

                  <tr className='pipeLineMnagement-container-list-item-contents-update-sale' align="center">
                    <td> 
                      <th>예상매출</th>
                    </td>

                    <td> 
                      <input name={'expectedSales'} type='text' value={setNumForm(newPipeLineData.expectedSales)} onChange={pipeLineDataChangeHandler} /> 
                    </td>

                    <td>
                      <th>예상매입</th>
                    </td>
                      
                    <td>
                      <input name={'expectedPurchase'} type='text' value={setNumForm(newPipeLineData.expectedPurchase)} onChange={pipeLineDataChangeHandler} /> 
                    </td>

                    <td> 
                      <th >예상이익</th>
                    </td>
                  
                    <td colSpan={3}>
                      <input name={'expectedProfit'} type='text' value={setNumForm(newPipeLineData.expectedSales-newPipeLineData.expectedPurchase)} onChange={pipeLineDataChangeHandler} /> 
                    </td>

                  </tr>
                </>
                :
                <>
                
                  <tr className='pipeLineMnagement-container-list-item-contents'>

                    <td  colSpan={1} align='center'> 
                      {item.typeName}
                    </td>

                    <td  colSpan={1} align='center'> 
                      {item.deptName}
                    </td>

                    <td  colSpan={1} align='center' > 
                      {item.customerName}
                    </td>

                    <td colSpan={1} align='center'> 
                      {item.title}
                    </td>
                      
                    <td colSpan={3}> 
                    {
                      pipeLineData.contents.map((item, index) => (
                        <div className='pipeLineMnagement-container-list-item-contents-textFile-box'>
                          <input className='pipeLineMnagement-container-list-item-contents-textFild-input' 
                            type='text' 
                            style={{font:item.font, color:item.color}} 
                            value={item.content} 
                            disabled
                          />
                        </div>
                      ))
                    }
                    </td>

                  </tr>

                  <tr className='pipeLineMnagement-container-list-item-contents-sale' align="center">
                    <td> 
                      <th>예상매출</th>
                    </td>

                    <td > 
                      {setNumForm(newPipeLineData.expectedSales)}(원)
                    </td>

                    <td >
                      <th>예상매입</th>
                    </td>
                      
                    <td >
                      {setNumForm(newPipeLineData.expectedPurchase)}(원)
                    </td>

                    <td  > 
                      <th >예상이익</th>
                    </td>

                    <td  colSpan={2}>
                      {setNumForm(newPipeLineData.expectedProfit)}(원)
                    </td>

                  </tr>
                </>

              }

              <tr className='pipeLineMnagement-container-list-item-contents-button-box' align="center">
                <td colSpan={7}>
                  {
                    isUpdateView ?
                    <button className='pipeLineMnagement-container-list-item-contents-updateButton' onClick={()=>onUpdate()} >확인</button>
                    :
                    <button className='pipeLineMnagement-container-list-item-contents-updateButton' onClick={()=>onUpdateView()} >수정</button>
                  }
                
                  <button className='pipeLineMnagement-container-list-item-contents-cencleButton' onClick={()=>cencleUpdate()}>취소</button>
                </td>
              </tr>
            </>
            :
            ''
        }

    </>
  )
}

export default PipeLineListTable