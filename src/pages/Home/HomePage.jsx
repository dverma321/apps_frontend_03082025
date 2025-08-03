import { useEffect, useState } from 'react';
import { FaMobileAlt, FaWindows, FaBars } from 'react-icons/fa';

const Homepage = () => {
  const [androidApps, setAndroidApps] = useState([]);
  const [pcProducts, setPcProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const apiUrl = import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PROD_API_URL;

  const token = localStorage.getItem("jwtoken");

  // Function to shuffle array and get daily random items
  const getDailyRandomItems = (array, count) => {
    // Create a seed based on current date (changes daily)
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // Fisher-Yates shuffle with seed
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor((seed % (i + 1)) * Math.random());
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Android apps from the new endpoint
        const androidResponse = await fetch(`${apiUrl}/android/only-android-apps`);
        const androidData = await androidResponse.json();
        const dailyAndroidApps = getDailyRandomItems(androidData.apps, 8);
        setAndroidApps(dailyAndroidApps);

        // Fetch PC products with authentication
        const pcResponse = await fetch(`${apiUrl}/computer/only-computer-apps`);
        const pcData = await pcResponse.json();
        const dailyPcProducts = getDailyRandomItems(pcData.products, 8);
        setPcProducts(dailyPcProducts);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, token]);

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-gray-50 to-gray-100">
     

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mt-5 mb-6 animate-fade-in">
            Discover Amazing Apps
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 animate-fade-in-delay">
            Explore our daily curated collection of top Android and Windows applications
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Android Apps Section */}
        <section id="android" className="mb-20">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <FaMobileAlt className="text-2xl text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Featured Android Apps</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 h-80 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : androidApps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {androidApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="h-48 bg-gray-100 overflow-hidden relative">
                    {app.image ? (
                      <img
                        src={app.image}
                        alt={app.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <FaMobileAlt className="text-gray-400 text-4xl" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      {app.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {app.version && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          v{app.version}
                        </span>
                      )}
                      {app.price && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {app.price}
                        </span>
                      )}
                      {app.category && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {app.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <p className="text-gray-500">No Android apps available at the moment.</p>
            </div>
          )}
        </section>

        {/* PC Products Section */}
        <section id="windows" className="mb-20">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <FaWindows className="text-2xl text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Featured Windows Apps</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 h-80 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : pcProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {pcProducts.map((product) => (
                <div
                  key={product.name}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Product Image */}
                  <div className="h-48 bg-gray-100 overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                        {product.name}
                      </h3>
                      {product.price && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {product.price}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {product.category && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      )}
                      {product.Version && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          v{product.Version}
                        </span>
                      )}
                     
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <p className="text-gray-500">No Windows apps available at the moment.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-3">
                <div className="p-2 bg-white rounded-lg mr-3">
                  <FaMobileAlt className="text-xl text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">AppShowcase</h3>
              </div>
              <p className="text-gray-400 max-w-md">
                Your trusted source for discovering the best applications for your devices.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 text-center sm:text-left">
              <div>
                <h4 className="font-bold mb-3">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Home</a></li>
                  <li><a href="#android" className="text-gray-400 hover:text-white transition-colors duration-300">Android Apps</a></li>
                  <li><a href="#windows" className="text-gray-400 hover:text-white transition-colors duration-300">Windows Apps</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Contact Us</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} AppShowcase. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;