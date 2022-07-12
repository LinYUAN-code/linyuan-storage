import { useState } from 'react'
import { useStore } from 'linyuan-storage'
import './ShowInfo.sass'



function ShowInfo() {
  let store = useStore();
  console.log(store);
  console.log("ShowInfo rerender~");
  return (
    <div className="App">
      <h2>User Info</h2>
      <div>
        <h3>age</h3>
        {store.user.a.b.age}
      </div>
      <div>
        <h3>name</h3>
        {store.user.name}
      </div>
      <div>
        <h3>hobby</h3>
        <ul>
          {
            store.user.hobby.map(v=>{
              return (
                <li key={v}>
                  {v}
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default ShowInfo
