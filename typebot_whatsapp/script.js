document.addEventListener('DOMContentLoaded', () => {
    const chatListItems = document.querySelectorAll('.chat-item');
    const chatArea = document.querySelector('.chat-area');
    const sidebar = document.querySelector('.sidebar');
    const backButton = document.querySelector('.chat-header .back-button'); // Para responsividade

    chatListItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remover a classe 'active' de todos os itens
            chatListItems.forEach(el => el.classList.remove('active'));
            // Adicionar a classe 'active' ao item clicado
            item.classList.add('active');

            // Simular a troca de informações do cabeçalho do chat
            const contactName = item.querySelector('.contact-name').textContent;
            const contactImageSrc = item.querySelector('img').src;

            chatArea.querySelector('.chat-header .contact-name').textContent = contactName;
            chatArea.querySelector('.chat-header img').src = contactImageSrc;

            // Em telas menores, fechar a sidebar ao selecionar um chat
            if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Funcionalidade básica para enviar mensagem (apenas visual)
    const messageInput = document.querySelector('.input-area input');
    const sendButton = document.querySelector('.send-button');
    const messageContainer = document.querySelector('.message-container');

    sendButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText !== '') {
            const newMessage = document.createElement('div');
            newMessage.classList.add('message', 'sent');
            newMessage.innerHTML = `<p>${messageText}</p><span class="message-time">${getCurrentTime()}</span>`;
            messageContainer.appendChild(newMessage);
            messageInput.value = '';
            messageContainer.scrollTop = messageContainer.scrollHeight; // Manter a rolagem no final
        }
    });

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });

    function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Lógica para abrir/fechar a sidebar em telas menores (opcional)
    const sidebarToggleButton = document.querySelector('.sidebar-header .fa-message'); // Pode usar outro ícone
    if (sidebarToggleButton) {
        sidebarToggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Lógica para o botão de voltar (em telas menores)
    if (backButton) {
        backButton.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
    } else if (window.innerWidth <= 768) {
        // Se não houver o botão, cria um dinamicamente
        const header = document.querySelector('.chat-header');
        const backBtn = document.createElement('i');
        backBtn.classList.add('fas', 'fa-arrow-left', 'back-button');
        backBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
        header.prepend(backBtn);
    }
});