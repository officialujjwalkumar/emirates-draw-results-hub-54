
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface RaffleWinner {
  id: string;
  prize: string;
}

interface ResultCardProps {
  drawType: 'Mega7' | 'Easy6' | 'Fast5';
  date: string;
  winningNumbers: string[];
  totalWinners: number;
  totalPrizes: string;
  raffleWinners: RaffleWinner[];
}

const ResultCard = ({ 
  drawType, 
  date, 
  winningNumbers, 
  totalWinners, 
  totalPrizes, 
  raffleWinners 
}: ResultCardProps) => {
  const [showWinners, setShowWinners] = useState(false);
  
  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Convert month from string to number and subtract 1 (months are 0-indexed in JS)
    const monthIndex = parseInt(month, 10) - 1;
    const monthName = months[monthIndex];
    
    return `${day} ${monthName} ${year}`;
  };

  // Determine draw day and time based on draw type
  const getDrawDayAndTime = (type: string) => {
    let day = 'Sunday';
    const time = '9:00 PM';
    
    switch(type) {
      case 'Easy6':
        day = 'Friday';
        break;
      case 'Fast5':
        day = 'Saturday';
        break;
      default:
        day = 'Sunday';
    }
    
    return { day, time };
  };

  const { day, time } = getDrawDayAndTime(drawType);

  // Get card header color class based on draw type
  const getHeaderClass = () => {
    switch(drawType) {
      case 'Mega7':
        return 'bg-gradient-to-r from-blue-600 to-blue-400';
      case 'Easy6':
        return 'bg-gradient-to-r from-red-600 to-red-400';
      case 'Fast5':
        return 'bg-gradient-to-r from-green-600 to-green-400';
      default:
        return 'bg-gradient-to-r from-blue-600 to-blue-400';
    }
  };

  // Get number bubble color class based on draw type
  const getNumberClass = () => {
    switch(drawType) {
      case 'Mega7':
        return 'bg-blue-600';
      case 'Easy6':
        return 'bg-red-600';
      case 'Fast5':
        return 'bg-green-600';
      default:
        return 'bg-blue-600';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all hover:translate-y-[-5px] hover:shadow-xl border border-gray-200 dark:border-gray-700">
      <div className={`${getHeaderClass()} px-4 py-3 text-white text-center`}>
        <h3 className="text-xl font-bold">{drawType}</h3>
        <p className="text-sm opacity-90">Draw Results</p>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-bold text-gray-800 dark:text-gray-200">Draw Date:</span> {formatDate(date)}
          </div>
          <div>
            <span className="font-bold text-gray-800 dark:text-gray-200">Time:</span> {time} ({day})
          </div>
        </div>
        
        <h4 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Winning Numbers</h4>
        <div className="flex flex-wrap justify-center gap-2 my-4">
          {winningNumbers.map((number, index) => (
            <div 
              key={index} 
              className={`${getNumberClass()} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-transform animate-[pop_0.3s_ease-out]`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {number}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-5 mb-4 text-center">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{totalWinners}</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Total Winners</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{totalPrizes}</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Total Prizes</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{winningNumbers.length}</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Numbers Drawn</span>
          </div>
        </div>
        
        <div className="mt-5 text-center">
          <h4 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Raffle Winners</h4>
          
          <button
            onClick={() => setShowWinners(!showWinners)}
            className="px-4 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
          >
            {showWinners ? 'Hide Winners' : 'Click to View'}
          </button>
          
          {showWinners && (
            <div className="mt-3 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              {raffleWinners.map((winner, index) => (
                <div 
                  key={index}
                  className="flex justify-between py-2 px-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 text-sm"
                >
                  <span className="text-gray-800 dark:text-gray-200">{winner.id}</span>
                  <span className="text-gray-600 dark:text-gray-400">{winner.prize}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
