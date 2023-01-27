import React from 'react'
import '../css/TableList.css'

const TableList = ({tableData}) => {

  return (
    <>
        {
            tableData.map((data, index) => (
                <tr className='tableList-data-box' key={index} align="center">
                    <td>{data.h}</td>
                    <td>
                        {
                            data.s ? 
                                <span className='tableList-true-status'>
                                    등록
                                </span> : 
                                <span className='tableList-false-status'>
                                    미등록
                                </span> 
                        } 
                    </td>
                    <td>{data.year}</td>
                </tr>
            ))
        }
    </>

  )
}

export default TableList
