import React, { useState } from 'react';
import { useContent } from '../ContentContext';
import type { GalleryImage } from '../types';

const GallerySection: React.FC = () => {
    const { content } = useContent();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    const goToNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % content.gallery.length);
    };

    const goToPrevious = () => {
        setCurrentImageIndex((prev) => (prev - 1 + content.gallery.length) % content.gallery.length);
    };

    // Keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'ArrowLeft') goToPrevious();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, currentImageIndex]);

    if (!content.gallery || content.gallery.length === 0) return null;

    return (
        <section id="gallery" className="py-20 bg-white scroll-mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pdi-dark-blue">
                            {content.galleryTitle}
                        </h2>
                        <p className="mt-4 text-lg text-pdi-gray whitespace-pre-line">
                            {content.gallerySubtitle}
                        </p>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {content.gallery.map((item, index) => (
                            <GalleryCard
                                key={index}
                                image={item}
                                index={index}
                                onClick={() => openLightbox(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <Lightbox
                    image={content.gallery[currentImageIndex]}
                    onClose={closeLightbox}
                    onNext={goToNext}
                    onPrevious={goToPrevious}
                    currentIndex={currentImageIndex}
                    totalImages={content.gallery.length}
                />
            )}
        </section>
    );
};

// Gallery Card Component
const GalleryCard: React.FC<{
    image: GalleryImage;
    index: number;
    onClick: () => void;
}> = ({ image, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
        >
            <img
                src={image.image}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white text-sm font-medium line-clamp-2">
                            {image.caption}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Lightbox Component
const Lightbox: React.FC<{
    image: GalleryImage;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
    currentIndex: number;
    totalImages: number;
}> = ({ image, onClose, onNext, onPrevious, currentIndex, totalImages }) => {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                aria-label="Close lightbox"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Previous Button */}
            {totalImages > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrevious();
                    }}
                    className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                    aria-label="Previous image"
                >
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Image Container */}
            <div
                className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={image.image}
                    alt={image.alt}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
                {/* Caption and Counter */}
                <div className="mt-4 text-center">
                    {image.caption && (
                        <p className="text-white text-lg mb-2">{image.caption}</p>
                    )}
                    <p className="text-gray-400 text-sm">
                        {currentIndex + 1} / {totalImages}
                    </p>
                </div>
            </div>

            {/* Next Button */}
            {totalImages > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                    aria-label="Next image"
                >
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default GallerySection;
