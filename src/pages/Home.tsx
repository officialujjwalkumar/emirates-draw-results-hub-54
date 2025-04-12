
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  draw_type: 'Mega7' | 'Easy6' | 'Fast5';
  date: string;
  winning_numbers: string;
  total_winners: number;
  total_prizes: string;
  winning_raffleids: string;
}

const Home = () => {
  const [results, setResults] = useState<DrawResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<DrawResult[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    if (results.length > 0) {
      filterResults(activeTab);
    }
  }, [activeTab, results]);

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
            draw_type: 'Mega7',
            date: '12-04-2025',
            winning_numbers: '7,14,22,31,38,46,50',
            total_winners: 143,
            total_prizes: 'AED 100,000',
            winning_raffleids: 'ED-2345678 - AED 10,000|ED-3456789 - AED 5,000'
          },
          {
            id: 2,
            draw_type: 'Easy6',
            date: '10-04-2025',
            winning_numbers: '5,12,18,27,33,44',
            total_winners: 92,
            total_prizes: 'AED 50,000',
            winning_raffleids: 'ED-1234567 - AED 5,000|ED-2345678 - AED 2,500'
          },
          {
            id: 3,
            draw_type: 'Fast5',
            date: '11-04-2025',
            winning_numbers: '3,9,15,25,37',
            total_winners: 78,
            total_prizes: 'AED 25,000',
            winning_raffleids: 'ED-3456789 - AED 2,500|ED-4567890 - AED 1,500'
          }
        ];
        
        setResults(dummyResults);
        setFilteredResults(dummyResults);
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

  const filterResults = (filter: string) => {
    if (filter === 'all') {
      setFilteredResults(results);
    } else {
      const filtered = results.filter(result => result.draw_type === filter);
      setFilteredResults(filtered);
    }
    setActiveTab(filter);
  };

  const handleRefresh = () => {
    fetchResults();
    toast({
      title: "Results refreshed!",
      description: "The latest draw results have been updated.",
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
    <div className="flex flex-col min-h-screen">
      <Toast 
        message="Results refreshed successfully!" 
        visible={showToast} 
        onClose={() => setShowToast(false)} 
      />
      
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-400 py-16 px-4">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="text-white text-center lg:text-left lg:max-w-xl mb-8 lg:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Emirates Draw Results
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Check the latest results for Mega7, Easy6, and Fast5 draws
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <a 
                href="#latest-results" 
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-full shadow-lg hover:bg-opacity-90 transition text-center"
              >
                View Latest Results
              </a>
              <Link 
                to="/blog" 
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-full hover:bg-white hover:text-blue-600 transition text-center"
              >
                Read Our Blog
              </Link>
            </div>
          </div>
          <div className="w-full max-w-md lg:max-w-lg">
            <img 
              src="https://emiratesdraw.com/images/hero-image.png" 
              alt="Emirates Draw" 
              className="w-full h-auto object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>
      
      <section id="latest-results" className="py-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
              Latest Draw Results
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Last Updated: <span>{lastUpdated || 'Loading...'}</span>
              </span>
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => filterResults('all')}
              >
                All Results
              </button>
              <button
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === 'Mega7' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => filterResults('Mega7')}
              >
                Mega7
              </button>
              <button
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === 'Easy6' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => filterResults('Easy6')}
              >
                Easy6
              </button>
              <button
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === 'Fast5' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => filterResults('Fast5')}
              >
                Fast5
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
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
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto mt-6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.length > 0 ? (
                filteredResults.map((result, index) => (
                  <ResultCard
                    key={result.id}
                    drawType={result.draw_type}
                    date={result.date}
                    winningNumbers={result.winning_numbers.split(',').map(num => num.trim())}
                    totalWinners={result.total_winners}
                    totalPrizes={result.total_prizes}
                    raffleWinners={parseRaffleWinners(result.winning_raffleids)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">No results found for {activeTab}.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 py-16 px-4 text-white text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Try Your Luck?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join millions of participants in the Emirates Draw for a chance to win life-changing prizes!
          </p>
          <a
            href="https://emiratesdraw.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-blue-600 font-medium rounded-full shadow-lg hover:bg-opacity-90 transition inline-block"
          >
            Participate Now
          </a>
        </div>
      </section>
      
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Featured Articles
            </h2>
            <Link 
              to="/blog" 
              className="text-blue-600 hover:text-blue-700 font-medium mt-2 md:mt-0"
            >
              View All Articles
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform hover:translate-y-[-5px] hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://emiratesdraw.com/images/blog/lucky-numbers.jpg" 
                  alt="Lucky Numbers" 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Finding Your Lucky Numbers</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Discover strategies for selecting potentially winning numbers for your next draw.</p>
                <Link 
                  to="/blog" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Read More 
                  <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform hover:translate-y-[-5px] hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://emiratesdraw.com/images/blog/winners-stories.jpg" 
                  alt="Winners Stories" 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Recent Winners' Stories</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Read inspiring stories from recent Emirates Draw winners and how it changed their lives.</p>
                <Link 
                  to="/blog" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Read More 
                  <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform hover:translate-y-[-5px] hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://emiratesdraw.com/images/blog/draw-process.jpg" 
                  alt="Draw Process" 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">How the Draw Process Works</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Learn about the transparent and fair process used in the Emirates Draw.</p>
                <Link 
                  to="/blog" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Read More 
                  <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
