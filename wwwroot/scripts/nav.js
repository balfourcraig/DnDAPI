const navLinks = [
    {
        name: 'Home',
        link: '/index.html'
    },
    {
        name: 'NPC Builder',
        link: '/pages/npcBuilder.html'
    },
    {
        name: 'House Builder',
        link: '/pages/houseBuilder.html'
    },
    {
        name: 'Combat',
        link: '/pages/combat.html'
    },
];

function buildNav(){
    const nav = document.getElementById('nav');
    const pagePrefix = '';//nav.getAttribute('pagePrefix') ?? '';
    nav.innerHTML = '';
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach((link) => {
        const a = document.createElement('a');
        a.setAttribute('href', pagePrefix + link.link);
        a.innerHTML = link.name;
        const linkPage = link.link.split('/').pop();
        if(linkPage === currentPage)
            a.setAttribute('class', 'selected');
        nav.appendChild(a);
    });
    const pageWidthHolder = document.querySelector('.pageWidth');
    const keySet = document.createElement('a');
    keySet.setAttribute('href', '#');
    keySet.innerHTML = 'Set User Key';
    keySet.addEventListener('click',  () => {
        const key = prompt('Enter your user key');
        setCookie('userKey', key, 365);
    });
    pageWidthHolder.appendChild(keySet);
}

document.addEventListener('DOMContentLoaded', () => {
    buildNav();
});