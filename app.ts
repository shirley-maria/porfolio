const themeButton = document.querySelector('#btn-tema') as HTMLButtonElement | null;
themeButton?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});