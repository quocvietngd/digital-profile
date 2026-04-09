// Initialize confetti
const canvas = document.getElementById('confetti-canvas');
const confetti = new Confetti(canvas);

// Gift button event listener
const giftBtn = document.getElementById('giftBtn');
giftBtn.addEventListener('click', function() {
    const rect = giftBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Create fireworks effect
    confetti.burst(x, y, 200);
    
    // Add button animation
    giftBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        giftBtn.style.transform = 'scale(1)';
    }, 100);

    // Optional: Sound effect (uncomment if you want)
    // playSound();
});

// Add some interactivity
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});