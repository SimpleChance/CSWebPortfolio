// Simple script to fade in sections on the landing page

// Select all sections
const sections = document.querySelectorAll('section');

// Create an Intersection Observer for section visibility of sections
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.25) {
        entry.target.classList.add('visible');
      } else if (entry.intersectionRatio <= 0.15){
        entry.target.classList.remove('visible');
      }
    });
  },
  { threshold: [0.15, 0.25] }
);

// Observe each section
sections.forEach((section) => observer.observe(section));
