import React, { useState, useEffect } from 'react';
import { useContent } from '../ContentContext';

const Pattern1: React.FC<{ className?: string }> = ({ className }) => (
    /* ... SVG content ... */
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <pattern id="p1" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <path d="M 0 5 L 80 5 M 0 15 L 80 15 M 0 25 L 80 25 M 0 35 L 80 35 M 0 45 L 80 45 M 0 55 L 80 55 M 0 65 L 80 65 M 0 75 L 80 75" stroke="#FECACA" strokeWidth="1" />
            </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#p1)" />
    </svg>
);

const Pattern2: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <pattern id="p2" x="10" y="10" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="#FECACA"></circle>
            </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#p2)"></rect>
    </svg>
);

const Pattern3: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <pattern id="p3" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0,10 L 10,0 M 10,20 L 20,10" stroke="#FECACA" strokeWidth="1"></path>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#p3)"></rect>
    </svg>
);

const Pattern4: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <pattern id="p4" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="10" stroke="#FECACA" strokeWidth="1" fill="none"></circle>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#p4)"></rect>
    </svg>
);

const Pattern5: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <pattern id="p5" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 0 0 L 15 30 L 30 0 Z" fill="rgba(254, 202, 202, 0.5)"></path>
            </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#p5)" />
    </svg>
);

const Pattern6: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <pattern id="p6" width="25" height="25" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <path d="M 12.5 0 L 12.5 25 M 0 12.5 L 25 12.5" stroke="#FECACA" strokeWidth="1"></path>
            </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#p6)" />
    </svg>
);


const backgroundPatterns = [
    <Pattern1 key="p1" className="w-full h-full" />,
    <Pattern2 key="p2" className="w-full h-full" />,
    <Pattern3 key="p3" className="w-full h-full" />,
    <Pattern4 key="p4" className="w-full h-full" />,
    <Pattern5 key="p5" className="w-full h-full" />,
    <Pattern6 key="p6" className="w-full h-full" />,
];

const HeroSection: React.FC = () => {
    const { content } = useContent();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % content.services.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [content.services.length]);

    const handleLearnMoreClick = () => {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden text-center bg-white">
            {/* Loader */}
            <div className="absolute top-0 left-0 h-1 w-full z-20">
                <div
                    key={currentIndex}
                    className="h-full bg-pdi-red animate-slide-progress"
                ></div>
            </div>

            {/* Background Patterns Slideshow */}
            {backgroundPatterns.map((PatternComponent, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    {PatternComponent}
                </div>
            ))}

            {/* Content Container */}
            <div className="relative z-10 px-4 flex flex-col items-center w-full max-w-7xl mx-auto">
                {/* Text Slideshow Container */}
                <div className="relative w-full h-auto min-h-[200px] md:min-h-[240px] mb-8 flex items-center justify-center">
                    {content.services.map((service, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <h1 className="text-4xl md:text-6xl font-extrabold text-pdi-red tracking-tight leading-tight w-full px-4 md:px-8 text-center">
                                {service.title.split(' ').map((word, i) => (
                                    <span key={i} className="inline-block mx-1">{word}</span>
                                ))}
                            </h1>
                        </div>
                    ))}
                </div>

                {/* Learn More Button */}
                <button
                    onClick={handleLearnMoreClick}
                    className="bg-pdi-red hover:bg-pdi-red/90 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                    Learn More
                </button>
            </div>
        </section>
    );
};

export default HeroSection;