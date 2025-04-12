
import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import ResultCard from '../components/ResultCard';
import Toast from '../components/Toast';
import { useToast } from '../components/ui/use-toast';

interface RaffleWinner {
  id: string;
  prize: string;
}

interface DrawResult {
  id: number;
  draw_type: 'Fast5';
  date: string;
  winning_numbers: string;
  total_winners: number;
  total_prizes: string;
  winning_raffleids: string;
}

const Fast5 = () => {
  const [results, setResults] = useState<DrawResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For this demo, we'll simulate a fetch with a timeout
      setTimeout(() => {
        // Simulate data load - in a real app you'd fetch from an API
        const dummyResults: DrawResult[] = [
          {
            id: 1,
            draw_type: 'Fast5',
            date: '11-04-2025',
            winning_numbers: '3,9,15,25,37',
            total_winners: 78,
            total_prizes: 'AED 25,000',
            winning_raffleids: 'ED-3456789 - AED 2,500|ED-4567890 - AED 1,500'
          },
          {
            id: 2,
            draw_type: 'Fast5',
            date: '04-04-2025',
            winning_numbers: '1,7,13,22,31',
            total_winners: 63,
            total_prizes: 'AED 25,000',
            winning_raffleids: 'ED-7788990 - AED 2,500|ED-8899001 - AED 1,500'
          }
        ];
        
        setResults(dummyResults);
        setIsLoading(false);
        updateTimeStamp();
      }, 1000);
    } catch (error) {
      console.error('Error fetching results:', error);
      setIsLoading(false);
    }
  };

  const updateTimeStamp = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit',
      month: 'long', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    
    const timeString = now.toLocaleString('en-US', options) + ' IST';
    setLastUpdated(timeString);
  };

  const handleRefresh = () => {
    fetchResults();
    toast({
      title: "Results refreshed!",
      description: "The latest FAST5 draw results have been updated.",
    });
  };

  const parseRaffleWinners = (raffleString: string): RaffleWinner[] => {
    if (!raffleString) return [];
    
    return raffleString.split('|').map(winner => {
      const parts = winner.trim().split(' - ');
      if (parts.length === 2) {
        return {
          id: parts[0].trim(),
          prize: parts[1].trim()
        };
      }
      return { id: winner.trim(), prize: '' };
    });
  };

  return (
    <div className="py-10 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Toast 
        message="Results refreshed successfully!" 
        visible={showToast} 
        onClose={() => setShowToast(false)} 
      />
      
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">FAST5 Results</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Check the latest FAST5 draw results to see if you've won a share of the AED 25,000 prize.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            <span className="font-medium">Last Updated:</span> {lastUpdated || 'Loading...'}
          </div>
          
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Results
          </button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((item) => (
              <div key={item} className="animate-pulse rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800">
                <div className="h-16 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="flex justify-center my-6">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div key={n} className="w-10 h-10 mx-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4">
                    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result) => (
              <ResultCard
                key={result.id}
                drawType={result.draw_type}
                date={result.date}
                winningNumbers={result.winning_numbers.split(',').map(num => num.trim())}
                totalWinners={result.total_winners}
                totalPrizes={result.total_prizes}
                raffleWinners={parseRaffleWinners(result.winning_raffleids)}
                onRefresh={handleRefresh}
              />
            ))}
          </div>
        )}
        
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">About FAST5</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            FAST5 is Emirates Draw's quickest game offering players a chance to win instant prizes with just 5 numbers.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Players select 5 numbers from 1 to 31. Match all 5 numbers in any order to win the Grand Prize. There are also prizes for matching fewer numbers.
          </p>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Prize Structure</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-left text-gray-800 dark:text-gray-200">Match</th>
                    <th className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-left text-gray-800 dark:text-gray-200">Prize Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Match 5 of 5</td>
                    <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">AED 25,000</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-750">
                    <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Match 4 of 5</td>
                    <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">AED 2,500</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Match 3 of 5</td>
                    <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">AED 250</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-750">
                    <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Match 2 of 5</td>
                    <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">AED 25</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fast5;
