document.addEventListener('DOMContentLoaded', () => {
    updateLinks();
    const holder = document.getElementById('rawContent');
    const url = document.getElementById('url');
    if(holder &&  url && url.innerText !== '') {
        holder.innerHTML = '';
        fetchDnDData(url.innerText, holder)
    }
});
