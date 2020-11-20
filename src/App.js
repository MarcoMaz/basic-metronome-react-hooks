import { useEffect, useState } from 'react';
import './App.css';

function noteDurationToMs (bpm) {
  return 60000 / bpm    ///// 60.000 ms = 1minuto ---> questa e' la durata di 1 beat a 100bpm in ms
}

function scheduleNote(ac, time) {
  let osc = ac.createOscillator()
  osc.connect( ac.destination )
  osc.start( time )
  osc.stop( time + 1/4 )
  console.log('**********   time is ' + time)
}

const ac = new AudioContext()
let to
let lastNote = 0

const App = () => {
  const [bpm, setBpm] = useState( 100 )
  const [run, setRun] = useState( false )    

  const handleChangeBPM = ( e ) => setBpm( e.target.value )

  const step = noteDurationToMs( bpm ) / 1000     //// Step e' la lunghezza di un beat in secondi
  const lookAhead = step / 2                      //// Lookahead guarda avanti nel tempo di mezzo beat
  console.log('step is ' + step)
  console.log('lookAhead is ' + lookAhead)

  const timer = () => {
    const diff = ac.currentTime - lastNote
    console.log('------------- diff = ac.currentTime(' + ac.currentTime + ') - lastNote(' + lastNote + ') = ' + diff)
    if ( diff >= lookAhead ) {
      const nextNote = lastNote + step
      console.log('********** DIFF(' + diff + ') >= lookAhead(' + lookAhead + ')')
      console.log('********** nextNote = lastNote(' + lastNote + ') + step(' + step + ') = ' + nextNote + ' ... lastNote = ' + nextNote) 
      scheduleNote( ac, nextNote, 0.025 )
      lastNote = nextNote
      }
    }

  const start = () => {
    ac.resume()
    setRun( true )
  }

  const stop = () => {
    clearInterval( to )
    setRun( false )
  }

  const toggle = () => run ? stop() : start()

  useEffect(() => {
    if ( run ) {
      clearInterval( to )
      to = setInterval( timer, step / 4 )
      console.log('to inside useEffect is ' + to)
      }
    })

  return (
    <div className='app'>
      <h1>Metronome</h1>
      <label htmlFor='beats'>4 / 4</label><br/>
      <input id='beaats' type='range' min='1' max='20' step='1' value='4' readOnly/><hr/>
      <label htmlFor='bpm'>{ bpm } BPM</label><br/>
      <input id='bpm' type='range' min='40' max='200' step='1' onChange={ handleChangeBPM}  value={ bpm } /><hr/>
      <button onClick={ toggle }>{ !run ? 'Start' : 'Stop' }</button><br />
    </div>
  )}

export default App;

// function App() {
//   const [ isPlaying, setIsPlaying ] = useState(false)
//   const [ buttonLabel, setButtonLabel ] = useState('Play')
//   const [ beatIndex, setBeatIndex ] = useState(0)
//   const [ beatsPlayed, setBeatsPlayed ] = useState(0.0)
//   const [ timeSignNumerator, setTimeSignNumerator ] = useState(4)
//   const [ bpm, setBpm ] = useState(60)

//   /* Fix Vars */
//   const lookahead = 25.0
//   const secondsInOneMinute = 60.0
//   const timeSignDenominator = 4
//   const lastBeatIndex = timeSignNumerator - 1
//   const oneBeatInSeconds = secondsInOneMinute / bpm

//   // console.log('One beat = ' + oneBeatInSeconds + ' seconds')

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

//   const handleBpm = (e) => {
//     setBpm(e.target.value)
//   }

//   useEffect(() => {
//     if (isPlaying){
//       const timerID = setTimeout( () => nextNote(), lookahead)
//       return () => clearInterval(timerID)
//       }
//     })

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
