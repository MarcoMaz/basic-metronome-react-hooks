import { useEffect, useState } from 'react';
import './App.css';

const audioContext = new AudioContext()
let to
let lastNote = 0

const App = () => {
  const [ bpm, setBpm ] = useState( 100 )
  const [ isPlaying, setIsPlaying ] = useState( false )
  const [ beatIndex, setBeatIndex ] = useState( 0 )

  const oneBeatDurationInMs = (bpm) => 60000 / bpm                 /// 60.000 ms = 1 minute

  const scheduleNote = ( audioContext, time ) => {
    let osc = audioContext.createOscillator()
    osc.connect( audioContext.destination )
    osc.start( time )                             
    osc.stop( time + 1/16 )    
    if (lastNote === 0 ) osc.frequency.value = '440'

    setBeatIndex( beatIndex + 1 )

    if (beatIndex === 3 ) setBeatIndex(0)

    if (beatIndex === 0 ) {
      console.log('yeah')
      osc.frequency.value = '440'
    } else {
      console.log('nope')
      osc.frequency.value = '220'
    }
  }

  const handleChangeBPM = ( e ) => setBpm( e.target.value )

  const oneBeatInSeconds = oneBeatDurationInMs( bpm ) / 1000     

  const lookAhead = oneBeatInSeconds / 2                        /// Lookahead looks one beat forward in time

  const timer = () => {
    const diff = audioContext.currentTime - lastNote            /// audioContext.currentTime starts (in ms) when you load the browser
    if ( diff >= lookAhead ) {
      const nextNote = lastNote + oneBeatInSeconds
      scheduleNote( audioContext, nextNote)
      lastNote = nextNote

      }

    }

  const start = () => {
    audioContext.resume()
    setIsPlaying( true )
  }

  const stop = () => {
    clearInterval( to )
    setIsPlaying( false )
  }

  const toggle = () => isPlaying ? stop() : start()

  useEffect(() => {
    if ( isPlaying ) {

      clearInterval( to )
      to = setInterval( timer, oneBeatInSeconds / 4 )           /// Every "beat / 4" setInterval is called to check if everything works.
      }
    },)

  return (
    <div className='app'>
      <h1>Metronome</h1>
      <label htmlFor='beats'>4 / 4</label><br/>
      <input id='beaats' type='range' min='1' max='20' step='1' value='4' readOnly/><hr/>
      <label htmlFor='bpm'>{ bpm } BPM</label><br/>
      <input id='bpm' type='range' min='40' max='200' step='1' onChange={ handleChangeBPM}  value={ bpm } /><hr/>
      <button onClick={ toggle }>{ !isPlaying ? 'Start' : 'Stop' }</button><br />
      <p>{ beatIndex } beats played</p>
    </div>
  )}

export default App;

// function App() {
//   const [ beatIndex, setBeatIndex ] = useState(0)
//   const [ beatsPlayed, setBeatsPlayed ] = useState(0.0)
//   const [ timeSignNumerator, setTimeSignNumerator ] = useState(4)

//   /* Fix Vars */
//   const secondsInOneMinute = 60.0
//   const timeSignDenominator = 4
//   const lastBeatIndex = timeSignNumerator - 1
//   const oneBeatInSeconds = secondsInOneMinute / bpm

//   const nextNote = () => {
//     setBeatsPlayed( beatsPlayed + oneBeatInSeconds )
//     setBeatIndex( beatIndex + 1 )
//     if (beatIndex === lastBeatIndex ) setBeatIndex(0)

//     // console.log('called!')
//   }

//   const toggleMetronome = () => {
//     if ( !isPlaying ) {
//       setIsPlaying(true)
//       setButtonLabel('Stop')
//       nextNote()
//       // console.log('Metronome is playing...')
//     } else {
//       setIsPlaying(false)
//       setButtonLabel('Play')
//       // console.log('Metronome is NOT playing!')
//     }
//   }

//   return (
//     <div className="App">
//       <button onClick={() => setTimeSignNumerator( timeSignNumerator + 1 )}>+</button>
//       <button onClick={() => setTimeSignNumerator( timeSignNumerator - 1 )}>-</button>
//       <h1>
//        { timeSignNumerator } / { timeSignDenominator } 
//       </h1>
//       <div>{ bpm } BPM</div>
//       <input onChange={ handleBpm } type="range" min="40" max="200" step="1" value={ bpm }/>
//       <hr/>
//       <p>{ beatIndex }</p>
//       <p>{ beatsPlayed }</p>
//       <button onClick={ toggleMetronome }>{ buttonLabel }</button>
//     </div>
//   );
// }
