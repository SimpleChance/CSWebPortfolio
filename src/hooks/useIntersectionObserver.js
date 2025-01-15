import { useState, useEffect } from 'react';

const useIntersectionObserver = (selector, thresholds=[0.15, 0.25]) => {
    
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio >= thresholds[1]) {
                        setIsVisible(true);
                    } else if (entry.intersectionRatio <= thresholds[0]) {
                        setIsVisible(false);
                    }
                });
            },
            { threshold: thresholds }
        );

        const element = document.querySelector(selector);
        if (element) observer.observe(element);

        return () => element && observer.unobserve(element);
    }, [selector, thresholds]);

    return isVisible;
};

export default useIntersectionObserver;
