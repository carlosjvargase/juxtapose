
import React from "react";
import { motion } from "framer-motion";

function ImageComparator({ 
  beforeImage, 
  afterImage, 
  sliderPosition, 
  beforeLabel, 
  afterLabel, 
  description,
  date,
  logo,
  showElements,
  onSliderChange 
}) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    onSliderChange(Math.min(Math.max(percentage, 0), 100));
  };

  const handleTouchMove = (e) => {
    if (e.touches[0]) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      onSliderChange(Math.min(Math.max(percentage, 0), 100));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full aspect-[16/9] overflow-hidden rounded-lg shadow-lg"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{ touchAction: "none" }}
    >
      <img
        src={afterImage}
        alt="Después"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Antes"
          className="absolute top-0 left-0 w-[100vw] h-full object-cover"
          style={{ maxWidth: "none" }}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize select-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 w-10 h-10 -ml-5 rounded-full bg-white shadow-lg flex items-center justify-center">
          <div className="absolute left-0 w-[2px] h-8 bg-gray-400" />
          <div className="absolute right-0 w-[2px] h-8 bg-gray-400" />
        </div>
      </div>

      {showElements.includes('labels') && (
        <>
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm font-medium">
            {beforeLabel}
          </div>
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm font-medium">
            {afterLabel}
          </div>
        </>
      )}

      {showElements.includes('description') && description && (
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
          {description}
        </div>
      )}

      {showElements.includes('date') && date && (
        <div className="absolute bottom-16 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
          {date}
        </div>
      )}

      {showElements.includes('logo') && logo && (
        <img
          src={logo}
          alt="Logo"
          className="absolute top-4 left-1/2 -translate-x-1/2 h-8 w-auto"
        />
      )}
    </motion.div>
  );
}

export default ImageComparator;
