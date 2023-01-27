import dayjs from 'dayjs';
import React, { useState } from 'react'
import '../css/MainSession.css'
import TableList from './TableList';

const MainSession = () => {

    const [tableData, setTableData] = useState([
        {
            h:'OTS',
            s:true,
            year:'2020-02-11'
        },
        {
            h:'소클',
            s: false,
            year:''
        },
        {
            h:'OSSLAB',
            s:true,
            year:'2020-01-05'
        }
    ])

  return (
    <table>
        <thead >
            <tr className='mainSession-head'>
                <th colSpan="1" align="center">
                    <span className='mainSession-head-time'>
                        {dayjs().format("YYYY-MM-DD")}
                    </span>
                </th>
                <th colSpan="2" align="center">
                    <span className='mainSession-head-title'>
                        금일 파이프라인 등록 현황
                    </span>
                </th>
            </tr>

            <tr>
                <th>본부</th>
                <th>등록 여부</th>
                <th>최종 제출</th>
            </tr>
        </thead>

        <tbody>
            <TableList tableData={tableData}/>
        </tbody>

    </table>

    
  )
}

export default MainSession
