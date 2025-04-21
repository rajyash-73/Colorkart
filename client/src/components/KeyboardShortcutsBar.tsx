import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function KeyboardShortcutsBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800 text-white text-xs shadow-md relative">
      {/* Mobile View - Collapsible */}
      <div className="md:hidden">
        <div 
          className="py-2 px-4 flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="font-medium">Keyboard Shortcuts</span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {isExpanded && (
          <div className="px-4 pb-3 flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 bg-gray-700 rounded text-center min-w-[50px]">Space</div>
              <span>Generate new palette</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 bg-gray-700 rounded text-center min-w-[50px]">L</div>
              <span>Lock/unlock color</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 bg-gray-700 rounded text-center min-w-[50px]">C</div>
              <span>Copy color code</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Desktop View */}
      <div className="hidden md:flex py-1 px-4 justify-center items-center space-x-4">
        <div className="flex items-center space-x-1">
          <div className="px-2 py-1 bg-gray-700 rounded text-center">Space</div>
          <span>Generate new palette</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="px-2 py-1 bg-gray-700 rounded text-center">L</div>
          <span>Lock/unlock color</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="px-2 py-1 bg-gray-700 rounded text-center">C</div>
          <span>Copy color code</span>
        </div>
      </div>
    </div>
  );
}
