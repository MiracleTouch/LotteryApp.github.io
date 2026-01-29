class LotteryGenerator {
    constructor() {
        this.numbers = [];
        this.isRolling = false;
        this.container = document.getElementById('ballsContainer');
        this.btn = document.getElementById('generateBtn');
        this.historyEl = document.getElementById('historyNumbers');
        
        this.init();
    }

    init() {
        this.btn.addEventListener('click', () => {
            if (!this.isRolling) {
                this.startRoll();
            }
        });
    }

    startRoll() {
        this.isRolling = true;
        this.btn.style.pointerEvents = 'none'; // Disable button
        
        // Play sound effect could be added here
        if (navigator.vibrate) navigator.vibrate(50);

        // Reset display
        this.container.innerHTML = '';
        this.numbers = this.generateNumbers();
        
        // Add placeholder balls first
        for (let i = 0; i < 6; i++) {
            const ball = document.createElement('div');
            ball.className = 'ball';
            ball.textContent = '?';
            this.container.appendChild(ball);
        }

        // Reveal numbers one by one
        this.numbers.forEach((num, index) => {
            setTimeout(() => {
                this.animateBall(index, num);
            }, index * 200); // 200ms delay between each ball
        });

        // Re-enable button after all done
        setTimeout(() => {
            this.isRolling = false;
            this.btn.style.pointerEvents = 'auto';
            this.updateHistory(this.numbers);
        }, 6 * 200 + 500);
    }

    generateNumbers() {
        // Generate 6 unique numbers from 1 to 49
        const nums = new Set();
        while(nums.size < 6) {
            // Crypto-secure random number roughly
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            const num = (array[0] % 49) + 1;
            nums.add(num);
        }
        return Array.from(nums).sort((a, b) => a - b);
    }

    animateBall(index, finalNum) {
        const ball = this.container.children[index];
        
        // Rolling effect
        let counter = 0;
        const rollInterval = setInterval(() => {
            ball.textContent = Math.floor(Math.random() * 49) + 1;
            counter++;
            if (counter > 10) { // Roll for 10 frames
                clearInterval(rollInterval);
                this.finalizeBall(ball, finalNum);
            }
        }, 50);
    }

    finalizeBall(ball, num) {
        ball.textContent = num < 10 ? `0${num}` : num;
        ball.classList.add('active');
        if (navigator.vibrate) navigator.vibrate(20);
    }

    updateHistory(nums) {
        const formatted = nums.map(n => n < 10 ? `0${n}` : n).join(' ');
        this.historyEl.textContent = formatted;
        localStorage.setItem('lastLotteryNumbers', formatted);
    }
}

// Load last history if avaiable
document.addEventListener('DOMContentLoaded', () => {
    const last = localStorage.getItem('lastLotteryNumbers');
    if (last) {
        document.getElementById('historyNumbers').textContent = last;
    }
    new LotteryGenerator();
});
