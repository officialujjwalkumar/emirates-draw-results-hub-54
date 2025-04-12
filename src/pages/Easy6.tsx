
import { useEffect } from 'react';

const Easy6 = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <section className="bg-gradient-to-r from-red-600 to-red-400 rounded-xl p-10 mb-10 text-white text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Easy6 Draw</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Emirates Draw Easy6 offers exciting prizes with simpler gameplay and better odds.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">About Easy6</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Easy6 is designed to be an accessible and fun game with better odds of winning. The draw takes place every Friday at 9:00 PM UAE time.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          To participate, select 6 numbers from 1 to 49. Match all numbers in any order to win the grand prize!
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
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">6 of 6</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">AED 15,000,000</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">1 in 13,983,816</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">5 of 6</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">AED 150,000</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">1 in 55,491</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">4 of 6</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">AED 1,500</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">1 in 1,033</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">3 of 6</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">AED 150</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">1 in 57</td>
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
          className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-full shadow hover:bg-red-700 transition"
        >
          Play Easy6 Now
        </a>
      </section>
    </div>
  );
};

export default Easy6;
