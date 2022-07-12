import React from 'react'
import ReactDOM from 'react-dom/client'
import { initLogLevel, initStoreDeep } from 'linyuan-storage'
import ShowInfo from './ShowInfo'
import "../node_modules/simpledotcss/simple.min.css"
import ChangeInfo from './ChangeInfo'

let data = {
  user: {
    name: "linrenjun",
    a: {
      b: {
        age: 100
      }
    },
    hobby: ["game","火影"]
  },
  other: 1,
}

initStoreDeep(data);
initLogLevel(0);

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ShowInfo></ShowInfo>
    <ChangeInfo></ChangeInfo>
  </>
)
