"use strict";
const themeButton = document.querySelector('#btn-tema');
themeButton === null || themeButton === void 0 ? void 0 : themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
