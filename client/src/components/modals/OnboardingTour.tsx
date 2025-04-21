import React from "react";

interface OnboardingTourProps {
  onClose: () => void;
}

export default function OnboardingTour({ onClose }: OnboardingTourProps) {
  const handleStartTour = () => {
    // In a real implementation, we would use react-joyride to start the tour
    // For now, we'll just close the modal
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Welcome to Coolors.in!</h2>
          <button 
            className="text-gray-500 hover:text-gray-700" 
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="mb-4 sm:mb-6">
          <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">Let's take a quick tour to show you how to use this color palette generator.</p>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">1</div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Generate Colors</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Press the spacebar or click the "Generate" button to create a random color palette.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">2</div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Lock Colors</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Click the lock icon to keep a color when generating new palettes.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">3</div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Copy Color Codes</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Click on any color's hex code to copy it to your clipboard.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <button 
            className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm" 
            onClick={onClose}
          >
            Skip tour
          </button>
          <button 
            className="bg-primary hover:bg-blue-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm"
            onClick={handleStartTour}
          >
            Start Tour
          </button>
        </div>
      </div>
    </div>
  );
}
