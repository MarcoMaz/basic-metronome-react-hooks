import { useEffect, useState } from 'react';
import './App.scss';

let ac
let engine
let lastNote = 0
let nextNote = 0
let beatIndex
let barLength 
let circles
let oldActiveIndex

const App = () => {
  const [ isPlaying, setIsPlaying ] = useState( false )
  const [ bpm, setBpm ] = useState( 100 )
  const [ timeSignatureNumerator, setTimeSignatureNumerator ] = useState( 4 )
  const oneBeatDurationInMs = (bpm) => 60000 / bpm                // 60.000 ms = 1 minute
  const oneBeatInSeconds = oneBeatDurationInMs( bpm ) / 1000     
  const lookAhead = oneBeatInSeconds / 2                          // Lookahead looks one beat forward in time
  const active = '-active'

  circles = document.getElementsByClassName('beat')               // Select all the circles

  useEffect(() => {
    ac = new AudioContext()
    barLength = timeSignatureNumerator - 1
    
    const sound = ( ac, time ) => {
      // creates the sound, connects it and decides when it starts and stops
      let osc = ac.createOscillator()
      osc.connect( ac.destination )
      osc.start( time )                             
      osc.stop( time + 1/16 )    

      // If is the first beep, plays a higher sound
      if ( beatIndex  === 0) {
        osc.frequency.value = '800'
      } else {
        osc.frequency.value = '400'
      }

      // Remove the old active class after re-render
      oldActiveIndex = document.querySelector('.-active')
      if ( oldActiveIndex !== null ) oldActiveIndex.classList.remove( active )

      // Remove active class from previous beat
      if ( beatIndex > 0 ){
        circles[ beatIndex - 1 ].classList.remove( active )
      } else {
        circles[ barLength ].classList.remove( active )
      }

      // Add active class based on index on active beat
      if ( Number( circles[ beatIndex ].dataset.index ) === beatIndex ) {
        circles[ beatIndex ].classList.add( active )
      } 

      // If the beat reaches the end, starts over and resets the counter
      ( beatIndex === barLength ) ? beatIndex = 0 : beatIndex += 1
    }

    const timer = () => {
      // Calculates how long it was in ms from loading the browser to clicking the play button
      const diff = ac.currentTime - lastNote

      // Schedules the next note if the diff is larger then the setInterval
      if ( diff >= lookAhead ) {
        nextNote = lastNote + oneBeatInSeconds
        lastNote = nextNote
        sound( ac, nextNote )
      }
    }

    if ( isPlaying ){
      // If the metronome is playing resumes the audio context                       
      ac.resume()           
      clearInterval( engine )      
      engine = setInterval( timer, oneBeatInSeconds / 25.0) 
    } else {
      // If the metronome is stopped, resets all the values                               
      ac.suspend()
      clearInterval( engine )                 
      lastNote = 0
      nextNote = 0
      beatIndex = 0
    }

    return () => clearInterval(engine)
  })

  // If the BPM changes, suspend the context and resets all the values
  const handleChangeBPM = ( e ) => {
    ac.suspend()
    setBpm( e.target.value )
    lastNote = 0
    nextNote = 0  
    beatIndex = 0
  }
    
  // If the time signature changes, suspend the context and resets all the values
  const handleTimeSignatureNumerator = ( e ) => {
    ac.suspend()
    setTimeSignatureNumerator( Number( e.target.value ) )
    lastNote = 0
    nextNote = 0
    beatIndex = 0
  }

  // By clicking the button starts or stops the metronome
  const toggleButton = () => ( isPlaying === true ) ? setIsPlaying( false ) : setIsPlaying( true )

  return(
    <div className="App">
      <div className="metro">{
        [...Array(timeSignatureNumerator)].map((x, i) => (
          <div key={ i } data-index={ i } 
          className={ 'beat' + ( isPlaying ? ' beat-plays' : '' )}></div>
          ))
      }
      </div><hr/>
      <label htmlFor='beats'>{ timeSignatureNumerator } / 4</label><br/>
      <input id='beats' type='range' min='3' max='5' step='1' onChange={ handleTimeSignatureNumerator } value={ timeSignatureNumerator }/><hr/>
      <label htmlFor='bpm'>{ bpm } BPM</label><br/>
      <input id='bpm' type='range' min='40' max='200' step='1' onChange={ handleChangeBPM }  value={ bpm } /><hr/>
      <button onClick={ toggleButton }>{ !isPlaying ? 'Play' : 'Stop'}</button>
    </div>
  )
}

export default App;