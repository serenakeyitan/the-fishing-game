import React, { useState, useEffect } from 'react';
import './DollarRain.css';
import dollarImage from './dollar.png'; // Adjust the path if necessary

const DollarRain = () => {
  const [dollars, setDollars] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      addDollar();
    }, Math.random() * 2000 + 2000); // Random interval between 2 to 4 seconds

    return () => clearInterval(interval);
  }, []);

  const addDollar = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const newDollar = {
      id,
      left: Math.random() * 90 + 5, // Random position between 5% to 95%
      animationDuration: Math.random() * 2 + 1, // Random drop duration between 1 to 3 seconds
    };
    setDollars((prevDollars) => [...prevDollars, newDollar]);

    // Automatically remove dollar after its animation ends
    setTimeout(() => {
      setDollars((prevDollars) => prevDollars.filter((dollar) => dollar.id !== id));
    }, (newDollar.animationDuration + 1) * 1000);
  };

  const handleClick = (id) => {
    setDollars((prevDollars) => prevDollars.filter((dollar) => dollar.id !== id));
  };

  return (
    <div className="dollar-rain-container">
      {dollars.map((dollar) => (
        <img
          key={dollar.id}
          src={dollarImage}
          alt="Dollar"
          className="dollar"
          style={{
            left: `${dollar.left}%`,
            animationDuration: `${dollar.animationDuration}s`,
          }}
          onClick={() => handleClick(dollar.id)}
        />
      ))}
    </div>
  );
};

export default DollarRain;
