    document.addEventListener('DOMContentLoaded', () => {
        const rollBtn = document.getElementById('rollBtn');
        rollBtn.addEventListener('click', generateQuest);
        generateQuest();
    });

    function generateQuest(){
        const questHolder = document.getElementById('missionBlock');
        questHolder.innerHTML = buildQuest();
    }