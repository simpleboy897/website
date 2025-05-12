const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const screenshotInput = document.getElementById('screenshot');

const MAX_MEMBERS = 7;

function loadChats() {
  const chats = JSON.parse(localStorage.getItem('chats')) || [];
  const now = Date.now();

  // Filter chats older than 24 hours
  const recentChats = chats.filter(chat => now - chat.timestamp < 24 * 60 * 60 * 1000);
  localStorage.setItem('chats', JSON.stringify(recentChats));

  chatBox.innerHTML = '';
  recentChats.forEach(chat => {
    const div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `<strong>${chat.username}:</strong> ${chat.message}`;
    if (chat.image) {
      const img = document.createElement('img');
      img.src = chat.image;
      div.appendChild(img);
    }
    chatBox.appendChild(div);
  });
}

function saveChat(chat) {
  const chats = JSON.parse(localStorage.getItem('chats')) || [];

  const uniqueUsers = new Set(chats.map(c => c.username));
  if (!uniqueUsers.has(chat.username) && uniqueUsers.size >= MAX_MEMBERS) {
    alert('Only 7 members allowed in the group.');
    return false;
  }

  chats.push(chat);
  localStorage.setItem('chats', JSON.stringify(chats));
  return true;
}

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const message = messageInput.value.trim();
  const file = screenshotInput.files[0];

  if (!username || !message) return;

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const chat = {
        username,
        message,
        image: reader.result,
        timestamp: Date.now()
      };
      if (saveChat(chat)) {
        loadChats();
        chatForm.reset();
      }
    };
    reader.readAsDataURL(file);
  } else {
    const chat = {
      username,
      message,
      image: null,
      timestamp: Date.now()
    };
    if (saveChat(chat)) {
      loadChats();
      chatForm.reset();
    }
  }
});

window.onload = loadChats;
