import { useEffect, useRef } from 'react'
import './chat.css'
import NewPrompt from '@/components/newPrompt/NewPrompt';

const Chatpage = () => {
  
  return (
    <div className='chatPage'>
      <div className='wrapper'>
        <div className='chat'>
          <div className='message'> Text msg</div>
          <div className='message user'> Text msg from user</div>
          <div className='message'> Text msg</div>
          <div className='message user'> Text msg from user</div>
          <div className='message'> Text msg</div>
          <div className='message user'> Text msg from user</div>
          <div className='message'> Text msg</div>
          <div className='message user'> Text msg from user</div>
          <div className='message'> Text msg</div>
          <div className='message user'> Text msg from user</div>
          <div className='message'> Text msg</div>
          <div className='message user'> Text msg from user</div>
          <div className='message'> Text msg</div>
          <div className='message user'> Text msg from user</div>
          <div className='message'> Text msg</div>
          <div className='message user'> Text msg from user</div>
          <NewPrompt />
          
        </div>
      </div>
    </div>
  )
}

export default Chatpage