import React from 'react'
import Loading from "./assets/chatbotLoading.gif";

export default function ChatLoading() {
  return (
    <div style={{height:"300px"}}>
        <img src={Loading} style={{maxWidth:"150px",marginTop:"52px"}} alt="Loading" />
    </div>
  )
}
