import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing-container px-4">
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center fade-in max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-slate-800 tracking-tight">
            Daily Activities Tracker
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-500 mb-8 sm:mb-10 leading-relaxed">
            Take control of your day. Track your tasks, analyze your performance,
            and stay consistently productive with a beautiful premium experience.
          </p>
          <div className="flex flex-col w-full sm:flex-row sm:w-auto gap-4 justify-center">
            <Link to="/register" className="premium-btn text-center text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/login" className="border-[1.5px] border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold rounded-lg px-8 py-3 transition-colors text-center text-lg">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
