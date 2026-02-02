const { useState } = React;

export const ToggleApp = () => {
    const [isVisible, setIsVisible] = useState(false);
    
    const handleToggleVisibility = () => {
        setIsVisible(!isVisible);
    }

    return (
        <div id="toggle-container">
            <button onClick={handleToggleVisibility} id="toggle-button">{isVisible ? "Hide" : "Show"} Certificate</button>
            <p id="message">ReactJS Projects For Beginners</p>

            {isVisible && <img 
            src="./Certificate/ReactJS-Projects-For-Beginners.png" 
            alt="ReactJS Certificate" 
            width="300" 
        />
        }
        </div>
    );
};

function Card({ name, title, bio, image, children }) {
    return (
      <div className="card">
        {image && <img src={image} alt={name} className="card-img" />}
        <h2>{name}</h2>
        <p className="card-title">{title}</p>
        <p>{bio}</p>
        {children} {/* This allows extra React components to be injected */}
      </div>
    );
}
  