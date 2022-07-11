import { useState } from 'react'
import { useStore } from '../../../src'
import './App.css'



function App() {
  let store = useStore();
  console.log(store);
  console.log(store.user);
  console.log(store.user.a);
  console.log(store.user.a.b.age);
  

  return (
    <div className="App">
      {store.user.name}
    </div>
  )
}

export default App
