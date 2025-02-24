const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',  // Include your React component files
  ],
  theme: {
    extend: {
      backgroundImage: {
        'divyanshu':'url("../src/Images/background/bottom_green.jpg")',
        'tanya':'url("../src/Images/background/silver_tree.jpg")'
      }
    },
  },
  plugins: [],
});
