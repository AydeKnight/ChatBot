import './App.css';
import Chatbot from './chatbot';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import VoiceValue from './demiAxios';
function App() {
  initializeIcons();

  return (
    <div className="App">
      <div className='Paragon'>
        ARPITH's LIVE DEMO
        <VoiceValue/>
      </div>
      <Chatbot />
    </div>
  );
}

export default App;
