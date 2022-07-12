


import React, { useState } from 'react'
import { useStore } from 'linyuan-storage'

export default function ChangeInfo() {
    const store = useStore((state)=>{
        state.user.name;
        state.user.a.b.age;
    });
    const [hobby,setHobby] = useState("");

    return (
        <div>
            <h2>ChangeInfo</h2>
            <div>
                <label htmlFor="name">name: </label><input type="text" id='name' value={store.user.name} onChange={(e)=>{
                    store.user.name = e.target.value;
                }}/>
            </div>
            <div>
                <button onClick={()=>{
                    store.user.a.b.age++;
                }}>增加年龄</button>
            </div>
            <div>
                <input type="text" value={hobby} onChange={(e)=>{
                    setHobby(e.target.value);
                }}/>
                <button onClick={()=>{
                    store.user.hobby.push(hobby);
                }}>增加爱好</button>
            </div>
            <div>
                <button 
                    onClick={()=>{
                        store.user.hobby[1] = store.user.hobby[1] === "海贼王" ? "火影" : "海贼王";
                    }}
                >改变爱好</button>
            </div>
        </div>
    )
}
