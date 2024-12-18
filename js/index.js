// Simple script to fade in sections on the landing page

// Select all sections
const sections = document.querySelectorAll('section');

// Create an Intersection Observer
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); // Add the 'visible' class
      }
      else {
        entry.target.classList.remove('visible'); //Remove the 'visible' class
      }
    });
  },
  { threshold: 0.25 } // Trigger when 20% of the section is visible
);

// Observe each section
sections.forEach((section) => observer.observe(section));
