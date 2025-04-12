
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const blogPosts = [
    {
      id: 1,
      title: 'How to Choose Lucky Numbers for Emirates Draw',
      excerpt: 'Learn strategies and tips on how to select potential winning numbers for Emirates Draw games. From birthdays to statistical analysis, discover what might work for you.',
      image: 'https://emiratesdraw.com/images/blog/lucky-numbers.jpg',
      date: 'April 10, 2025',
      url: '#'
    },
    {
      id: 2,
      title: 'Recent Big Winners and Their Life-Changing Stories',
      excerpt: 'Meet some of the recent Emirates Draw winners who had their lives transformed overnight. From paying off debts to starting new businesses, these stories will inspire you.',
      image: 'https://emiratesdraw.com/images/blog/winners-stories.jpg',
      date: 'April 5, 2025',
      url: '#'
    },
    {
      id: 3,
      title: 'Complete Guide to Understanding Emirates Draw Games',
      excerpt: 'A comprehensive breakdown of all Emirates Draw games - Mega7, Easy6, and Fast5. Learn about the rules, prizes, and strategies for each game format.',
      image: 'https://emiratesdraw.com/images/blog/draw-process.jpg',
      date: 'March 28, 2025',
      url: '#'
    },
    {
      id: 4,
      title: 'The History and Impact of Emirates Draw',
      excerpt: 'Explore the origins of Emirates Draw, its growth over the years, and the positive impact it has made on environmental conservation and local communities.',
      image: 'https://emiratesdraw.com/images/blog/winners-stories.jpg',
      date: 'March 15, 2025',
      url: '#'
    },
    {
      id: 5,
      title: 'How to Claim Your Prize if You Win',
      excerpt: 'A step-by-step guide to claiming your prize if you win in any of the Emirates Draw games, including documentation required and processing times.',
      image: 'https://emiratesdraw.com/images/blog/lucky-numbers.jpg',
      date: 'March 5, 2025',
      url: '#'
    },
    {
      id: 6,
      title: 'Emirates Draw and Charitable Initiatives',
      excerpt: 'Discover how Emirates Draw contributes to various charitable causes and environmental initiatives across the UAE and beyond.',
      image: 'https://emiratesdraw.com/images/blog/draw-process.jpg',
      date: 'February 20, 2025',
      url: '#'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-white">Latest Blog Posts</h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
        Stay updated with news, tips, and stories about Emirates Draw results and winners
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map(post => (
          <article 
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform hover:translate-y-[-5px] hover:shadow-lg"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <div className="p-5">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{post.date}</div>
              <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{post.excerpt}</p>
              <Link 
                to={post.url} 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Read More <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
