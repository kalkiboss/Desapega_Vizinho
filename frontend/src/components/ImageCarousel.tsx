import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Tag, X } from 'lucide-react';

interface ImageCarouselProps {
    images?: string[];
    altTitle: string;
}

export default function ImageCarousel({ images = [], altTitle }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (isFullscreen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [isFullscreen]);

    if (!images || images.length === 0) {
        return (
            <div className="ad-card-image-placeholder">
                <Tag size={48} />
            </div>
        );
    }

    const isSingle = images.length === 1;

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const toggleFullscreen = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsFullscreen(!isFullscreen);
    };

    return (
        <>
            {isSingle ? (
                <img
                    src={images[0]}
                    alt={altTitle}
                    loading="lazy"
                    className="ad-card-image"
                    onClick={toggleFullscreen}
                    style={{ cursor: 'zoom-in' }}
                />
            ) : (
                <div className="carousel-container" onClick={toggleFullscreen} style={{ cursor: 'zoom-in' }}>
                    <img
                        src={images[currentIndex]}
                        alt={`${altTitle} - Foto ${currentIndex + 1}`}
                        loading="lazy"
                        className="ad-card-image"
                    />
                    <button className="carousel-btn prev" onClick={prevImage} aria-label="Foto anterior">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="carousel-btn next" onClick={nextImage} aria-label="Próxima foto">
                        <ChevronRight size={20} />
                    </button>
                    <div className="carousel-dots">
                        {images.map((_, idx) => (
                            <span key={idx} className={`dot ${idx === currentIndex ? 'active' : ''}`} />
                        ))}
                    </div>
                </div>
            )}

            {isFullscreen && (
                <div className="fullscreen-overlay" onClick={toggleFullscreen}>
                    <button className="fullscreen-close-btn" onClick={toggleFullscreen} aria-label="Fechar tela cheia">
                        <X size={32} />
                    </button>

                    <img
                        src={images[currentIndex]}
                        alt={`${altTitle} - Tela Cheia`}
                        className="fullscreen-image"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {!isSingle && (
                        <>
                            <button className="carousel-btn prev fullscreen-nav" onClick={prevImage}>
                                <ChevronLeft size={36} />
                            </button>
                            <button className="carousel-btn next fullscreen-nav" onClick={nextImage}>
                                <ChevronRight size={36} />
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    );
}