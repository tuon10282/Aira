import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  
  ngAfterViewInit() {
    // Move all the JavaScript code here
    const wrapper = document.querySelector('.testimonial-wrapper') as HTMLElement;
    const dots = document.querySelectorAll('.dot');
    const prevButtons = document.querySelectorAll('.prev-button');
    const nextButtons = document.querySelectorAll('.next-button');
    const testimonials = document.querySelectorAll('.testimonial');
    
    let currentIndex = 0;
    const totalSlides = testimonials.length;
    
    // Update the slider position
    function updateSlider() {
      if (wrapper) {
        wrapper.setAttribute('style', `transform: translateX(-${currentIndex * 100}%)`);
      }
      
      // Update active dot
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
    
    // Previous slide
    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
    }
    
    // Next slide
    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    }
    
    // Add event listeners to prev buttons
    prevButtons.forEach(button => {
      button.addEventListener('click', prevSlide);
    });
    
    // Add event listeners to next buttons
    nextButtons.forEach(button => {
      button.addEventListener('click', nextSlide);
    });
    
    // Add event listeners to dots
    dots.forEach((dot) => {
      // Use arrow function with explicit parameter typing to avoid 'this' context issues
      dot.addEventListener('click', (e: Event) => {
        const clickedDot = e.currentTarget as HTMLElement;
        const index = clickedDot.getAttribute('data-index');
        if (index !== null) {
          currentIndex = parseInt(index);
          updateSlider();
        }
      });
    });
    
    // Auto-slide functionality
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Pause auto-slide on mouse hover
    const testimonialContainer = document.querySelector('.testimonial-container') as HTMLElement;
    
    if (testimonialContainer) {
      testimonialContainer.addEventListener('mouseenter', function() {
        clearInterval(slideInterval);
      });
      
      // Resume auto-slide when mouse leaves
      testimonialContainer.addEventListener('mouseleave', function() {
        slideInterval = setInterval(nextSlide, 5000);
      });
    }
  }
}