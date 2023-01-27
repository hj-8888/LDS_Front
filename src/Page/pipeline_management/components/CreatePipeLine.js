import axios from 'axios'
import address from '../../../address_config'
import dayjs from 'dayjs'
import React, {useEffect, useState } from 'react'
import '../css/CreatePipeLine.css'

const CreatePipeLine = ({deptsList, customersList, typesList, onIsChangeData, onCreateView}) => {

  const [contentData, setContentData] = useState([
    {
      index:'',
      font:'',
      color:'',
      content:''
  
    }
  ])

  const formatData = 
  {
    deptID: '', 
    customerID: '',
    typeID:'',
    title: '', 
    date: dayjs().format("YYYY-MM-DD"),
    contents: [    
      {
        font:'none',
        color:'none',
        content:''
      }
    ],
    expectedSales: 0,
    expectedPurchase: 0,
    expectedProfit: 0
  }

  const [newPipeLineData, setNewPipeLineData] = useState(formatData)

  const [color, setColor] = useState('none');
  const [font, setfont] = useState('none')

  const createPipelineData = async() => {
    await axios.post(`http://${address.ip}:${address.port}/pipeline/create`, newPipeLineData)
    .then((res) => {
      if(res.data.result == "FAIL"){
        console.log(res.data.msg)
        alert("추가 실패")
        console.log("실패")
        console.log(newPipeLineData)
      }
      else{
      }
    })
    .catch((err) => {
      console.error("error: " + {error: err} )
      console.log("pipeline list error")
    })
  }

  const createPipeLineDataChangeHandler = (e) => {
    let targetName = e.target.name;
    let targetValue = e.target.value.replace('/,/g', "");
    
    let isStr = true
    if(targetName == 'expectedSales' || targetName == 'expectedPurchase'){
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

  // 숫자 출력 형식 변경
  const setNumForm = (num) => {
    let targetValue = String(num);
    targetValue = targetValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return targetValue;
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
      resetStyleData()
    }

    setContentData(copyArray);
    
  }

  const cencleUpdate = () => {
    setNewPipeLineData(formatData)
    onCreateView()
    resetStyleData()
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
      try {
        const findIndex = contentData.findIndex(v => v.index == index);
        let isEmpty = newPipeLineData.contents[findIndex].content == ""
  
        if(isEmpty){
          newPipeLineData.contents.splice(index, 1)
        }
      } 
      catch {
      }

    }

    settingContentData(newPipeLineData.contents)

  }

  const onCreate = () => {
  
    if(newPipeLineData.deptID == ''){
      alert("본부 데이터는 필수 입니다.")
    }
    else if(newPipeLineData.customerID ==''){
      alert("고객사 데이터는 필수 입니다.")
    }
    else if(newPipeLineData.typeID ==''){
      alert("현황 데이터는 필수 입니다.")
    }
    else{
      if(newPipeLineData.expectedSales == ''){
        newPipeLineData.expectedSales = 0;
      }

      if(newPipeLineData.expectedPurchase == ''){
        newPipeLineData.expectedPurchase = 0;
      }
      createPipelineData()
      onCreateView()
      onIsChangeData()
    }

  }

  const resetStyleData = () => {
    setColor('none')
    setfont('none')
  }


  useEffect(()=>{
    let profit = newPipeLineData.expectedSales - newPipeLineData.expectedPurchase;
    setNewPipeLineData({
      ...newPipeLineData,
      ['expectedProfit'] : profit,
    });
  },[newPipeLineData.expectedSales, newPipeLineData.expectedPurchase])

  return (
    <>
      <thead >
        <tr className='createPipeLine-container-list-item-contents-header' align='center' >
          <td  colSpan={1}> 
            <th>현황</th>
          </td>

          <td  colSpan={1}> 
            <th>본부</th>
          </td>

          <td  colSpan={1}> 
            <th>사업명</th>
          </td>

          <td colSpan={1}> 
            <th >고객사</th>
          </td>
                    
          <td colSpan={3}> 
            <th>내용</th>
          </td>
        </tr>
      </thead>
              
      <tbody>

        <tr className='createPipeLine-container-list-item-update-contents'>

          <td  colSpan={1} > 
            <select name={'typeID'} size={1} onChange={createPipeLineDataChangeHandler}>
              <option disabled selected>현황 선택</option>
              {
                typesList.map((v)=>(
                  <option value={v.typeID}>{v.typeName}</option>
                ))
              }
            </select>
          </td>

          <td  colSpan={1} > 
            <select name={'deptID'} onChange={createPipeLineDataChangeHandler}>
                <option disabled selected>본부 선택</option>
                {
                  deptsList.map((v)=>(
                    <option value={v.deptID}>{v.deptName}</option>
                  ))
                }
            </select>
          </td>

          <td  colSpan={1}  >
            <input className='createPipeLine-container-list-item-update-content' name={'title'} type='text' value={newPipeLineData.title} onChange={createPipeLineDataChangeHandler} />  
          </td>
                        
          <td colSpan={1}> 
            <select name={'customerID'} onChange={createPipeLineDataChangeHandler}>
              <option disabled selected>고객사 선택</option>
              {
                customersList.map((v)=>(
                  <option value={v.customerID}>{v.customerName}</option>
                ))
              }
            </select>
          </td>
          
          <td className='createPipeLine-container-list-item-update-content-tag' colSpan={4}> 
            {
              contentData.map((item, index) => (
                <div className='createPipeLine-textFile-box'>
                  <input 
                    className='createPipeLine-textFild-input' 
                    type='text' 
                    style={{fontWeight:item.font, color:item.color}} 
                    value={item.content} 
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

        <tr className='createPipeLine-container-list-item-contents-update-sale' align="center">
          <td width='7%'> 
            <th>예상매출</th>
          </td>

          <td  width='8%'> 
            <input name={'expectedSales'} type='text' value={setNumForm(newPipeLineData.expectedSales)} onChange={createPipeLineDataChangeHandler} /> 
          </td>

          <td width='8%' >
            <th>예상매입</th>
          </td>
                        
          <td width='8%'>
            <input name={'expectedPurchase'} type='text' value={setNumForm(newPipeLineData.expectedPurchase)} onChange={createPipeLineDataChangeHandler} /> 
          </td>

          <td  width='11%'> 
            <th >예상이익</th>
          </td>
                    
          <td width='20%'>
            <input name={'expectedProfit'} type='text' value={setNumForm(newPipeLineData.expectedProfit)} /> 
          </td>

        </tr>
      </tbody>
    
    <tfoot >
        <button className='createPipeLine-container-list-item-contents-updateButton' onClick={()=>onCreate()} >추가</button>
        <button className='createPipeLine-container-list-item-contents-cencleButton' onClick={()=>cencleUpdate(newPipeLineData)}>취소</button>
    </tfoot>
  </>
)
}

export default CreatePipeLine