import React, { useState, useEffect } from 'react';
import FishingSection from './components/FishingSection';
import InventorySection from './components/InventorySection';
import ProbabilityWindow from './components/ProbabilityWindow';
import './index.css';

function App() {
  const [inventory, setInventory] = useState({});
  const [selectedBait, setSelectedBait] = useState(null);
  const [ipBalance, setIpBalance] = useState(10);
  const [fishBalance, setFishBalance] = useState(10);
  const [fishPool, setFishPool] = useState(0);
  const [distributionTimer, setDistributionTimer] = useState(30);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0); // State for tracking the current score
  const [wonTokens, setWonTokens] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [probabilityStatus, setProbabilityStatus] = useState(true);

  useEffect(() => {
    const countdown = setInterval(() => {
      setDistributionTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setRound((prevRound) => prevRound + 1);
          console.log(`Round ${round} ended. Timer reset. Final Score: ${score}`);
          distributeRewards(); // Distribute rewards when the round ends
          setScore(0); // Reset score at the start of each round
          return 30;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [score, round]);

  const calculateRarestFish = (fish) => {
    const rarityScore = {
      mythical: 7,
      legendary: 6,
      epic: 5,
      superRare: 4,
      rare: 3,
      uncommon: 2,
      common: 1,
    };

    return rarityScore[fish] || 0;
  };

  const claimIpToken = () => {
    setIpBalance((prevBalance) => prevBalance + 1);
  };

  const claimFishToken = () => {
    setFishBalance((prevBalance) => prevBalance + 1);
    setIpBalance((prevBalance) => prevBalance - 1);
  };

  const handleFishing = (newCatch) => {
    console.log("handleFishing called with newCatch:", newCatch);

    // Update the balances before setting the state
    const updatedIpBalance = ipBalance - 1;
    const updatedFishPool = fishPool + 1;

    // Update the inventory with the new catch
    const updatedInventory = { ...inventory, [newCatch]: (inventory[newCatch] || 0) + 1 };

    // Decrement the selected bait quantity in the inventory
    if (updatedInventory[selectedBait] > 1) {
      updatedInventory[selectedBait] -= 1;
    } else {
      delete updatedInventory[selectedBait];
    }

    // Calculate the score based on the new catch only
    const newScore = calculateRarestFish(newCatch);

    // Update the total score by adding the newScore
    setScore((prevScore) => {
      const updatedScore = prevScore + newScore;
      console.log(`Updated Total Score: ${updatedScore}`);
      return updatedScore;
    });

    // Set the updated state locally
    setIpBalance(updatedIpBalance);
    setFishPool(updatedFishPool);
    setInventory(updatedInventory);

    console.log("handleFishing - Updated state:", {
      ipBalance: updatedIpBalance,
      fishBalance: fishBalance,
      fishPool: updatedFishPool,
      inventory: updatedInventory,
    });
  };

  const distributeRewards = () => {
    // Define the target score range
    const targetMinScore = 5;
    const targetMaxScore = 6;

    // Generate a random score within the target range
    const randomTargetScore = Math.floor(Math.random() * (targetMaxScore - targetMinScore + 1)) + targetMinScore;
    console.log(`Random Target Score for Rewards: ${randomTargetScore}`);
    
    // Check if the current score meets or exceeds the random target score
    if (score >= randomTargetScore) {
      const additionalFish = Math.floor(Math.random() * 11) + 18; // Random number between 18 and 28
      setFishBalance((prevBalance) => prevBalance + additionalFish);
      setWonTokens(additionalFish);  // Set the number of won tokens
      setAnimate(true);  // Trigger the animation
      console.log(`Reward distributed: ${additionalFish} FISH tokens.`);
    } else {
      console.log("No reward distributed this round.");
    }
  };

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => {
        setAnimate(false); // Reset animation after it's done
      }, 1000); // Match the duration of the animation
      return () => clearTimeout(timeout);
    }
  }, [animate]);

  return (
    <div className="container">
      <h1 className="round-counter">ROUND {round}</h1>
      <h1>Fishing Expedition with Bait</h1>
      <div className="notice">
        <strong>Top 15% of players who fish with the highest rarity score</strong> will get all the $FISH tokens of that round split! 
        <em>RarityScore will reset every round!</em>
      </div>
      <div className="faucets">
        <button onClick={claimIpToken}>Claim 1 $IP Token</button>
        <button onClick={claimFishToken}>Swap 1 $FISH Token</button>
      </div>
      <p>Your $IP Balance: {ipBalance}</p>
      <p>Your $FISH Balance: {fishBalance}</p>
      <p>Your Current Score: {score}</p>
      <p>Next Distribution in: {distributionTimer} seconds</p>
      {animate && (
        <div className="token-animation">+{wonTokens} FISH</div>
      )}
      <FishingSection
        inventory={inventory}
        setInventory={setInventory}
        selectedBait={selectedBait}
        setSelectedBait={setSelectedBait}
        handleFishing={handleFishing}
        ipBalance={ipBalance}
        setIpBalance={setIpBalance}
        fishBalance={fishBalance}
        setFishBalance={setFishBalance}
        setFishPool={setFishPool}
        fishPool={fishPool}
      />
      <InventorySection inventory={inventory} setSelectedBait={setSelectedBait} />
      <ProbabilityWindow selectedBait={selectedBait} isOpen={probabilityStatus} />
    </div>
  );
}

function generatePlayerId() {
  return `player_${Math.random().toString(36).substr(2, 9)}`;
}

export default App;
