
import { useEffect } from 'react';

const Fast5 = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <section className="bg-gradient-to-r from-green-600 to-green-400 rounded-xl p-10 mb-10 text-white text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Fast5 Draw</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Fast5 gives you the best odds of winning with a simple 5-number game and exciting prizes.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">About Fast5</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Fast5 is the quickest way to play and win with Emirates Draw. The draw takes place every Saturday at 9:00 PM UAE time.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          To participate, select 5 numbers from 1 to 35. Match all numbers in any order to win the grand prize!
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Prize Structure</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-gray-800 dark:text-white">Match</th>
                <th className="py-3 px-4 text-left text-gray-800 dark:text-white">Prize Amount</th>
                <th className="py-3 px-4 text-left text-gray-800 dark:text-white">Odds</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">5 of 5</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">AED 5,000,000</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">1 in 324,632</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">4 of 5</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">AED 50,000</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">1 in 1,426</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">3 of 5</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">AED 500</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">1 in 58</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="text-center py-8">
        <a 
          href="https://emiratesdraw.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-full shadow hover:bg-green-700 transition"
        >
          Play Fast5 Now
        </a>
      </section>
    </div>
  );
};

export default Fast5;
