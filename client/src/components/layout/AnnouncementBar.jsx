import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const announcements = [
  {
    icon: '🏫',
    text: 'Free Campus Pickup Available at Kinathukadavu 3D Lab Desk',
    highlight: 'Select at checkout',
    link: '/custom-order'
  },
  {
    icon: '🏆',
    text: 'Akshaya Techday & Science Fest Official Merch & Trophies Now Live',
    highlight: 'Explore drops',
    link: '/collection/event-merch'
  },
  {
    icon: '🔍',
    text: 'Live 3D Print Queue: Track your CAD model slicing status',
    highlight: 'Track live',
    link: '/track-order'
  }
];

export const AnnouncementBar = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = announcements[currentIdx];

  return (
    <div className="bg-[#00714C] text-white py-2 px-4 text-xs font-medium text-center relative z-50 shadow-sm border-b border-[#005a3c]">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <span>{current.icon}</span>
        <span className="tracking-wide text-stone-100">{current.text}</span>
        <span className="text-[#FFDA0F] font-bold">|</span>
        <Link to={current.link} className="text-[#FFDA0F] hover:text-white underline transition-colors font-bold tracking-wide">
          {current.highlight} ➔
        </Link>
      </div>
    </div>
  );
};
