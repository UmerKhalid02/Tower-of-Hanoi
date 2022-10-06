// <-- BSCS20002 -->

// Variables
var incBtn = document.getElementById('inc-btn');
var decBtn = document.getElementById('dec-btn');
var plates = document.getElementById('disk-count');
var Moves = document.getElementById('moves');
var undoBtn = document.getElementById('undo-btn');
var redoBtn = document.getElementById('redo-btn');
var towers, disks, draggedone, moves, prevParent, currParent, timeSec = 90;
var countDown, resBtn, closeBtn, message, totalMoves;
var initialTower, endTower, diskid;
var undoStates = [], redoStates = [];

message = document.querySelector('#message');
totalMoves = document.querySelector('#total-moves');
resBtn = document.getElementById('res');
closeBtn = document.getElementById('close');

resBtn.addEventListener('click', () => {
    menu.style.display = 'none';
    Restart();
});

closeBtn.addEventListener('click', () => {
    menu.style.display = 'none';
    ResetGame();
});

const menu = document.querySelector('.page-menu');
const menuBox = document.querySelector('.menu');

// Timer
const timeH = document.querySelector('#timer');
function SetCountDown(timeSec){
    var counter = timeSec;
    countDown = setInterval(() => {
        counter--;
        DisplayTime(counter);
        if(counter <= 0){
            message.innerHTML = `Time Up!`;
            totalMoves.innerHTML = `Moves: ${moves}`;
            menu.style.display = 'flex';
            menuBox.classList.add('animation');
            clearInterval(countDown);
        }
    }, 1000);
}

function DisplayTime(second){
    const min = Math.floor(second/60);
    const sec = Math.floor(second%60);
    timeH.innerHTML = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`
}

const start = document.getElementById('start');
const reset = document.getElementById('reset');

function initialize(){
    menu.style.display = 'none';
    moves = 0;
    undoBtn.disabled = true;
    redoBtn.disabled = true;

    undoBtn.classList.add('max');
    redoBtn.classList.add('max');

    AddEventsInDisks();
}

initialize();
decBtn.classList.add('max');
reset.disabled = true;
reset.classList.add('max');

function Start(){
    var disk1 = document.getElementById('disk-1');
    disk1.setAttribute('draggable', true);
    initialize();
    SetCountDown(timeSec);
}

function Restart(){
    clearInterval(countDown);
    SetCountDown(timeSec);
    
    var totalplates = parseInt(plates.textContent, 10);
    ResetTowers(totalplates);

    AddEventsInDisks();
    Setdrag();

    undoStates = [];
    redoStates = [];

    console.log("Undo: ", undoStates);
    console.log("Redo: ", redoStates);

    moves = 0;
    ResetMoves();
}

function ResetGame(){
    timeSec = 90;
    start.disabled = false;
    start.classList.remove('max');

    reset.disabled = true;
    reset.classList.add('max');

    incBtn.disabled = false;
    decBtn.disabled = false;
    incBtn.classList.remove('max');
    decBtn.classList.remove('max');

    plates.textContent = '3';
    clearInterval(countDown);
    timeH.innerHTML = `00:00`

    undoStates = [];
    redoStates = [];

    ResetTowers(3);
    ResetMoves();
    initialize();
}

// Start
start.addEventListener('click', ()=>{
    incBtn.disabled = true;
    decBtn.disabled = true;

    incBtn.classList.add('max');
    decBtn.classList.add('max');
    Start();
    start.disabled = true;
    start.classList.add('max');

    reset.disabled = false;
    reset.classList.remove('max');
    // start time... 
});

// Restart
reset.addEventListener('click', ResetGame);

incBtn.addEventListener('click', () => {
    var inc = plates.textContent;
    inc = parseInt(inc, 10);
    if(inc < 9){
        inc += 1;
        plates.textContent = inc;
        timeSec *= 1.3;
        console.log(timeSec);
        var tower = document.getElementById('tower-1');
        var newDisk = document.createElement('div');
        newDisk.classList.add('disks');
        newDisk.id = 'disk-' + inc;
        newDisk.setAttribute('draggable', false);
        tower.appendChild(newDisk);
        AddEventsInDisks();

        decBtn.classList.remove('max')
        decBtn.disabled = false;

        if(inc == 9){
            incBtn.classList.add('max');
            incBtn.disabled = true;
        }
    } 
});

decBtn.addEventListener('click', () => {
    var dec = plates.textContent;
    dec = parseInt(dec, 10);
    if(dec > 3){
        dec -= 1;
        plates.textContent = dec;
        timeSec /= 1.3;
        var tower = document.getElementById('tower-1');
        tower.lastChild.remove();
        AddEventsInDisks();
        
        incBtn.classList.remove('max')
        incBtn.disabled = false;

        if(dec == 3){
            decBtn.classList.add('max');
            decBtn.disabled = true;
        }
    }
})

// Undo Redo
undoBtn.addEventListener('click', ()=>{
    if(undoStates.length > 0){
        var u = undoStates.pop();
        moves--;
        SetMoves();
        if(undoStates.length == 0){
            undoBtn.disabled = true;
            undoBtn.classList.add('max');
        }

        redoStates.push(u);
        if(redoBtn.disabled = true){
            redoBtn.disabled = false;
            redoBtn.classList.remove('max');
        }

        var tower1 = document.getElementById(u.initialTower);
        var tower2 = document.getElementById(u.endTower);
        var disk = document.getElementById(u.diskid);
        
        tower2.removeChild(disk);
        tower1.prepend(disk);
    }
    
})

redoBtn.addEventListener('click', () => {
    if(redoStates.length > 0){
        var r = redoStates.pop();
        moves++;
        SetMoves();
        if(redoStates.length == 0){
            redoBtn.disabled = true;
            redoBtn.classList.add('max');
        }

        var tower1 = document.getElementById(r.initialTower);
        var tower2 = document.getElementById(r.endTower);
        var disk = document.getElementById(r.diskid);

        tower1.removeChild(disk);
        tower2.prepend(disk);

        initialTower = tower1.id;
        endTower = tower2.id;
        diskid = disk.id;

        undoStates.push({initialTower, endTower, diskid});
        if(undoBtn.disabled == true){
            undoBtn.disabled = false;
            undoBtn.classList.remove('max');
        }
        console.log(undoStates);
    }
})

// Dragging over Towers
for(tower of towers){
    tower.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    tower.addEventListener('dragenter', (e) => {
        e.preventDefault();

        const disk = document.getElementById(draggedone.id)

        if(e.target.childNodes.length > 0){
            if(e.target.childNodes[0].id > draggedone.id){
                e.target.style.opacity = '0.4'
            }
        } else{
            e.target.style.opacity = '0.4'
        }
    });

    tower.addEventListener('dragleave', (e) => {
        e.target.style.opacity = '1';
    });

    tower.addEventListener('drop', (e) => {
        e.target.style.opacity = '1';
        var disk = document.getElementById(draggedone.id);

        if(e.target.childNodes.length > 0){
            const child = e.target.firstChild;
            if(child.id > disk.id){
                if(e.target.className == 'tower'){
                    e.target.prepend(disk);
                    currParent = draggedone.parentElement;
                    if(prevParent.id != currParent.id){
                        moves++;
                        SetMoves();
                        isWin();
                        endTower = e.target.id;
                        undoStates.push({initialTower, endTower, diskid});
                        
                        if(undoBtn.disabled == true){
                            undoBtn.disabled = false;
                            undoBtn.classList.remove('max');
                        }
                    }
                }
            }
        } else {
            if(e.target.className == 'tower'){
                e.target.prepend(disk);
                currParent = draggedone.parentElement;
                if(prevParent.id != currParent.id){
                    moves++;
                    SetMoves();
                    endTower = e.target.id;
                    undoStates.push({initialTower, endTower, diskid});
                    
                    if(undoBtn.disabled == true){
                        undoBtn.disabled = false;
                        undoBtn.classList.remove('max');
                    }
                }
            }
        }
    });
}

function AddEventsInDisks(){
    towers = document.getElementsByClassName('tower');
    disks = document.getElementsByClassName('disks');

    for(disk of disks){
        disk.addEventListener('dragstart', (e) => {
            setTimeout(() => {
                e.target.className = 'hide';
            }, 0);
            draggedone = e.target;
            prevParent = draggedone.parentElement;
            diskid = e.target.id
            initialTower = e.target.parentElement.id;
        })

        disk.addEventListener('dragend', (e) => {
            e.target.className = 'disks';
            e.target.id = e.target.id;
            Setdrag();
        })
    }
}

function Setdrag(){
    for(tower of towers){
        if(tower.childNodes.length > 0){
            tower.firstChild.setAttribute('draggable', true);
        }

        if(tower.childNodes.length > 1){
            for(var i = 1; i < tower.childNodes.length; i++){
                tower.childNodes[i].setAttribute('draggable', false);
            }
        }
    }
}

function SetMoves(){
    Moves.textContent = moves;
}

function ResetTowers(towerPlates){
    towers = document.getElementsByClassName('tower');

    for(tower of towers){
        while(tower.firstChild){
            tower.firstChild.remove();
        }
    }

    count = 1;

    while(count <= towerPlates){
        var tower = document.getElementById('tower-1');
        var newDisk = document.createElement('div');
        newDisk.classList.add('disks');
        newDisk.id = 'disk-' + count;
        newDisk.setAttribute('draggable', false);
        tower.appendChild(newDisk);
        count++;
    }
}

function ResetMoves(){
    Moves.textContent = "0";
}

function isWin(){
    var totaldisks = parseInt(plates.textContent, 10);
    tower3 = document.getElementById('tower-3');

    if(tower3.childNodes.length == totaldisks){
        clearInterval(countDown);
        message.innerHTML = `You Win!`;
        totalMoves.innerHTML = `Moves: ${moves}`;
        menu.style.display = 'flex';
        menuBox.classList.add('animation');
    }
}