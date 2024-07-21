document.addEventListener('DOMContentLoaded', function() {
    // Countdown Timer
    const countdown = document.getElementById('countdown-timer');
    const eventDate = new Date('2024-12-31T00:00:00').getTime();
  
    const updateCountdown = setInterval(function() {
      const now = new Date().getTime();
      const distance = eventDate - now;
  
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
      countdown.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  
      if (distance < 0) {
        clearInterval(updateCountdown);
        countdown.innerHTML = 'Event Started!';
      }
    }, 1000);
  
    // Instagram Feed
    new InstagramFeed({
      username: 'hindu_society',
      container: document.getElementById('insta-feed'),
      display_profile: false,
      display_biography: false,
      display_gallery: true,
      styling: true,
      items: 8,
      items_per_row: 4,
      margin: 1
    });
  });
  

