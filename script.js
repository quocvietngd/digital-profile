// Game Đoán số
let secretNumber = Math.floor(Math.random() * 20) + 1;
let gameOver = false;
const gameStatus = document.getElementById('gameStatus');

document.getElementById('guessForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (gameOver) return;
    const guess = Number(document.getElementById('guessInput').value);
    if (!guess || guess < 1 || guess > 20) {
        gameStatus.textContent = 'Vui lòng nhập số từ 1 đến 20!';
        gameStatus.className = 'game-status error';
        return;
    }
    if (guess === secretNumber) {
        gameStatus.textContent = '🎉 Chính xác! Bạn quá đỉnh!';
        gameStatus.className = 'game-status success';
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
        gameOver = true;
        setTimeout(() => {
            secretNumber = Math.floor(Math.random() * 20) + 1;
            gameOver = false;
            gameStatus.textContent = 'Game đã reset, hãy thử lại!';
            gameStatus.className = 'game-status';
        }, 3000);
    } else if (guess < secretNumber) {
        gameStatus.textContent = 'Số bí mật lớn hơn!';
        gameStatus.className = 'game-status error';
    } else {
        gameStatus.textContent = 'Số bí mật nhỏ hơn!';
        gameStatus.className = 'game-status error';
    }
});
document.getElementById('giftBtn').addEventListener('click', function() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
});

const messages = JSON.parse(localStorage.getItem('guestMessages')) || [];
const messageStatus = document.getElementById('messageStatus');

function displayMessages() {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';
    messages.forEach(msg => {
        const msgElement = document.createElement('div');
        msgElement.className = 'message-item';
        msgElement.innerHTML = `
            <div class="sender-name">${msg.name}</div>
            <div class="message-text">${msg.text}</div>
        `;
        messagesList.appendChild(msgElement);
    });
}

function setStatus(text, type) {
    messageStatus.textContent = text;
    messageStatus.className = `message-status ${type}`;
}

document.getElementById('messageForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('senderName').value.trim();
    const text = document.getElementById('messageText').value.trim();

    if (!name || !text) {
        setStatus('Vui lòng điền tên và lời nhắn.', 'error');
        return;
    }

    setStatus('Đang gửi tin nhắn lên Telegram...', '');

    try {
        const TELEGRAM_BOT_TOKEN = '8402765083:AAHpUCJBi8MFTmv4A1Vs4VngUKa52_wiw08';
        const TELEGRAM_CHAT_ID = '5527590402';
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: `👤 ${name}\n\n💬 ${text}`,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();

        if (!response.ok || !result.ok) {
            throw new Error(result.description || 'Không gửi được tin nhắn');
        }

        messages.unshift({ name, text });
        localStorage.setItem('guestMessages', JSON.stringify(messages));
        document.getElementById('messageForm').reset();
        displayMessages();
        setStatus('Tin nhắn đã gửi vào Telegram thành công!', 'success');
    } catch (err) {
        setStatus(`Gửi thất bại: ${err.message}`, 'error');
    }
});

displayMessages();