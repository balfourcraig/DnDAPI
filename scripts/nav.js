const navLinks = [
    {
        name: 'Home',
        link: '/index.html'
    },
    {
        name: 'NPC',
        link: '/pages/npcBuilder.html'
    },
    {
        name: 'Houses',
        link: '/pages/houseBuilder.html'
    },
    {
        name: 'Hordes',
        link: '/pages/hordeRoller.html'
    },
    {
        name: 'Tavern',
        link: '/pages/tavern.html'
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
}

document.addEventListener('DOMContentLoaded', () => {
    buildNav();
});