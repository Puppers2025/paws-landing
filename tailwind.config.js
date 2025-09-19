module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        body: ['Quicksand', 'sans-serif'],
        button: ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        spinFast: 'spin 10s linear infinite',
        vortexSpin: 'vortexSpin 1.2s linear infinite',
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        vortexOut: 'vortexOut 2s ease-in-out forwards',
        /** Extended Animation Section / GAMEPLAY */
        jumpAnim: 'jumpAnim 0.6s ease-out',
        slideAnim: 'slideAnim 0.4s ease-in-out',
        boostAnim: 'boostAnim 0.8s ease-out',
        scrollBg: 'scrollBg 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-8px) translateX(-5px)' },
          '50%': { transform: 'translateY(-10px) translateX(6px)' },
          '75%': { transform: 'translateY(-8px) translateX(-5px)' },
          '100%': { transform: 'translateY(0px) translateX(0px)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        vortexOut: {
          '0%': { opacity: 1, transform: 'scale(1) rotate(0deg)' },
          '100%': { opacity: 0, transform: 'scale(0.1) rotate(720deg)' },
        },
        vortexSpin: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(360deg) scale(1.1)' },
          '100%': { transform: 'rotate(720deg) scale(1)' },
        },
        /** Extended Keyframes Section */
        jumpAnim: {
          '0%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-80px)' },
          '60%': { transform: 'translateY(-80px)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideAnim: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(20px) scaleY(0.8)' },
        },
        boostAnim: {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.1)', filter: 'brightness(1.8)' },
          '100%': { transform: 'scale(1)', filter: 'brightness(1)' },
        },
        scrollBg: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}