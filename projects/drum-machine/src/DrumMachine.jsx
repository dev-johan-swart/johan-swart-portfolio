import React from "react";

export default function DrumMachine() {
  const pads = [
    { key: "Q", name: "Heater-1", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3" },
    { key: "W", name: "Heater-2", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3" },
    { key: "E", name: "Heater-3", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3" },
    { key: "A", name: "Heater-4", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3" },
    { key: "S", name: "Clap", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3" },
    { key: "D", name: "Open-HH", url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3" },
    { key: "Z", name: "Kick-n'-Hat", url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3" },
    { key: "X", name: "Kick", url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3" },
    { key: "C", name: "Closed-HH", url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3" },
  ];

  const [display, setDisplay] = React.useState("Play a sound");
  const [powerOn, setPowerOn] = React.useState(true);
  const [volume, setVolume] = React.useState(1);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      const pad = pads.find((p) => p.key === key);
      if (pad) playSound(key, pad.name);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const playSound = (key, name) => {

    if (!powerOn) {
      setDisplay("");  
      return;     
    }
    const audio = document.getElementById(key);
    if (!audio) return;
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play();
    setDisplay(name);
  };

  return (
    <div id="drum-machine" className="drum-and-volume">
      <h1>My Drum Machine</h1>
      <div className="drum-grid">
        {pads.map((pad) => (
          <div
            key={pad.key}
            id={pad.name}
            className="drum-pad"
            onClick={() => playSound(pad.key, pad.name)}
          >
            {pad.key}
            <audio className="clip" id={pad.key} src={pad.url}></audio>
          </div>
        ))}
      </div>

      <div className="volume-control">
        <label>
          Volume
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div id="display" className="display">
        {display}
      </div>

      <div className="controls">

      <div className="power-control">
       <span className="power-label">Power</span>
        <label className="switch">
          <input 
          type="checkbox" 
          checked={powerOn}
          onChange={() => setPowerOn(prev => !prev)}
          />
          <span className="slider round"></span>
        </label>
        <span>{powerOn ? "On" : "Off"}</span>
      </div>
     </div>
      <p className="hint">(Q W E / A S D / Z X C)</p>
      <br />
      <p>Designed and created by <br />
       <em>Dev Johan Swart</em>
      </p>
    </div>
  );
}

