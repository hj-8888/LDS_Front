import React, { useEffect, useState } from 'react'
import './css/MainPage.css'
import SideBar from '../side_bar/SideBar'
import MainSession from './components/MainSession'
import CustomerManagement from '../customer_management/CustomerManagement'
import HeadquartersManagement from '../headquarters_management/HeadquartersManagement'
import PipeLineMnagement from '../pipeline_management/PipeLineMnagement'
import address from '../../address_config'
import axios from 'axios'

const Main = () => {

    const [mainData, setMainData] = useState(
        [
            {
                component: <MainSession />,
                title: '메인 화면'
            },
            {
                component: <CustomerManagement/>,
                title: "고객 현황"
            },
            {
                component: <HeadquartersManagement/>,
                title: "본부 현황"
            },
            {
                component: <PipeLineMnagement/>,
                title: "파이프라인 현황"
            }
        ]
    )

    const [curPage, setCurPage] = useState(0)
    
    // 사이드바에 전송될 텍스트 리스트
    // headMenu : 메뉴 타이틀
    // subMenu : 타이틀 클릭시 보이는 하위 메뉴
    const menuArr = [
        {
            headMenu:'고객 관리',
            subMenu:["고객 현황"]
        },
        {
            headMenu:'본부 관리',
            subMenu:["본부 현황"]
        },
        {
            headMenu:'파이프라인 관리',
            subMenu:["파이프라인 현황"]
        },
    ]
    
    const [pageNumArray, setPageNumArray] = useState([]);
    const [pageNumHistory, setPageNumHistory] = useState([]);

    const setMainItemsData = async() => {
        await axios.get(`http://${address.ip}:${address.port}/admin/customer`)
        .then((res) => {
          if(res.data.result == "FAIL"){
            alert("main list error")
          }
          else{
            setMainData(res.data.customerList)
          }
        })
        .catch((err) => {
          console.error("error: " + {error: err} )
          alert("customer list error")
          document.location.href = "/not"
        })
      }

    // 하위 메뉴에서 클릭한 번호가 return 되어 mainData에 컴포넌트가 선택
    // 하위 메뉴를 추가하면 MemuItem 컴포넌트 조건문에 추가 필요
    // 사이드 메뉴 클릭시 턴버튼에 추가
    const changPageNum = (num) => {
        setCurPage(num)
        setHistory(num)

        if(num === 0 ){ // 홈 아이콘에 대해서만 작용
            resetPageNum()
        }
        else if(!pageNumArray.includes(num)){
            setPageNumArray([...pageNumArray, num])
        }
    }

    // 메인 턴버튼에서 턴버튼 초기화를 막기위해 따로 생성
    const mainTurnbutton = () => {
        setCurPage(0)
        setHistory(0)
    }

    const setHistory = (num) => {
        setPageNumHistory([...pageNumHistory, num])
        let manuLength = mainData.length;

        if(pageNumHistory.length > manuLength*2){
            setPageNumHistory(pageNumHistory.slice(-1 * manuLength))
        }

    }

    const resetPageNum = () => {
        setPageNumArray([])
        setPageNumHistory([])
    }

    const closeTurnbutton = (num) => {
        setPageNumArray(()=>pageNumArray.filter(i => i !== num)) 
        setPageNumHistory(()=>pageNumHistory.filter(i => i !== num))
    }

    // Turnbutton에 변경이 생기는 경우 수행
    useEffect(()=>{
        if(pageNumArray.length === 0){
            setCurPage(0)
        }
        else{
            setCurPage(pageNumHistory.at(-1))
        }
    },[pageNumArray])

    useEffect(()=>{
        // setMainItemsData()
    },[])

  return (
    <div className='main-page-continer'>
        <div className='main-side'>
            <SideBar changPageNum={changPageNum} menuArr={menuArr}/>
        </div>

        <div className='main-page-box'>

            <div className='main-page-head'>
                <div className='main-page-body-select-menu'>
                    <div className='main-page-turnbutton' style={ curPage===0 ? {backgroundColor:'rgb(163, 5, 5)'} : {}} onClick={()=>{mainTurnbutton(0)}}>
                        {mainData[0].title}
                    </div> 
                    {
                        pageNumArray.map((n, index) => (
                            <div key={index} className='main-page-turnbutton' value={n} style={ curPage===n ? {backgroundColor:'rgb(163, 5, 5)'} : {}}>
                                <span className='main-page-turnbutton-title' onClick={()=>{changPageNum(n)}}>{mainData[n].title}</span>
                                <span className='main-page-turnbutton-close' value={n} onClick={() => closeTurnbutton(n)}>X</span>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='main-page-body'>
                <div className='main-page-body-contents'>
                    <div className='main-page-body-content'>
                        {mainData[curPage].component}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Main
