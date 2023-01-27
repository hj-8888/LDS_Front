import React from 'react';

const Test = () => {
  const arr = [
    {
      head:'영업관리',
      sub:["1","2"]
    }
  ]

  let headMenu = [];
  let subMenu = [];

const sttringTable = () => {
  for(let i=0; i<arr.length; i++){
    headMenu.push(<span key={i}>{arr[i].head}</span>)

    for(let j=0; j<arr[i].sub.length; j++){
      subMenu.push(<span key={j}>{arr[i].sub[j]}</span>)
    }

  }
}

    return (
      <div>
        {
          sttringTable()
        }
      </div>
    )
}

export default Test;
