import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [ isPlaying, setIsPlaying ] = useState(false)
  const [ buttonLabel, setButtonLabel ] = useState('Play')
  const [ beatIndex, setBeatIndex ] = useState(0)
  const [ beatsPlayed, setBeatsPlayed ] = useState(0.0)
  const [ timeSignNumerator, setTimeSignNumerator ] = useState(4)
  const [ bpm, setBpm ] = useState(60)

  /* Fix Vars */
  const lookahead = 25.0
  const secondsInOneMinute = 60.0
  const timeSignDenominator = 4
  const lastBeatIndex = timeSignNumerator - 1
  const oneBeatInSeconds = secondsInOneMinute / bpm

  // console.log('One beat = ' + oneBeatInSeconds + ' seconds')

  const nextNote = () => {
    setBeatsPlayed( beatsPlayed + oneBeatInSeconds )
    setBeatIndex( beatIndex + 1 )
    if (beatIndex === lastBeatIndex ) setBeatIndex(0)

    // console.log('called!')
  }

  const toggleMetronome = () => {
    if ( !isPlaying ) {
      setIsPlaying(true)
      setButtonLabel('Stop')
      nextNote()
      // console.log('Metronome is playing...')
    } else {
      setIsPlaying(false)
      setButtonLabel('Play')
      // console.log('Metronome is NOT playing!')
    }
  }

  const handleBpm = (e) => {
    setBpm(e.target.value)
  }

  useEffect(() => {
    if (isPlaying){
      const timerID = setTimeout( () => nextNote(), lookahead)
      return () => clearInterval(timerID)
      }
    })

  return (
    <div className="App">
      <button onClick={() => setTimeSignNumerator( timeSignNumerator + 1 )}>+</button>
      <button onClick={() => setTimeSignNumerator( timeSignNumerator - 1 )}>-</button>
      <h1>
       { timeSignNumerator } / { timeSignDenominator } 
      </h1>
      <div>{ bpm } BPM</div>
      <input onChange={ handleBpm } type="range" min="40" max="200" step="1" value={ bpm }/>
      <hr/>
      <p>{ beatIndex }</p>
      <p>{ beatsPlayed }</p>
      <button onClick={ toggleMetronome }>{ buttonLabel }</button>
    </div>
  );
}

export default App;
