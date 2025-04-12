
import { useEffect } from 'react';

const Mega7 = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl p-10 mb-10 text-white text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Mega7 Draw</h1>
        <p className="text-lg max-w-2xl mx-auto">
          The Emirates Draw Mega7 offers you the chance to win incredible prizes with 7 lucky numbers.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">About Mega7</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Mega7 is Emirates Draw's flagship game that offers participants the chance to win life-changing prizes by matching 7 numbers. The draw takes place every Sunday at 9:00 PM UAE time.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          To participate, select 7 numbers from 1 to 50. Match all numbers in any order to win the grand prize!
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
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">7 of 7</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">AED 100,000,000</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">1 in 85,900,584</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">6 of 7</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">AED 1,000,000</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">1 in 1,221,759</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">5 of 7</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">AED 100,000</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">1 in 43,949</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">4 of 7</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">AED 1,000</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">1 in 2,330</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">3 of 7</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">AED 100</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">1 in 192</td>
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
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-full shadow hover:bg-blue-700 transition"
        >
          Play Mega7 Now
        </a>
      </section>
    </div>
  );
};

export default Mega7;
