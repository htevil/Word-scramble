const wordContainer = document.getElementById("word");
const inputContainer = document.getElementById("input");
const tries = document.getElementsByClassName("tries");
const mistakeContainer = document.getElementById("mistake");
const randombtn = document.getElementById("random");
const resetbtn = document.getElementById("reset");

let word = "";
let x = 0;
let y = 1;
let q = 1;

function shuffleString(str) {
    const characters = str.split('');
    characters.sort(() => Math.random() - 0.5);
    return characters;
}

async function showResponse() {
    try{
        const response = await fetch('https://random-word-api.vercel.app/api?words=1');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        word = data[0];
        const shuffleword = shuffleString(word);

        console.log(word);
        
        for(i=0;i<shuffleword.length;i++){ 
            const wordElement = document.createElement('span');
            const inputElement = document.createElement('input');

            localStorage.setItem("sw", JSON.stringify(shuffleword));

            wordElement.textContent = shuffleword[i];
            wordElement.setAttribute('id', `qes-${i}`);
            inputElement.setAttribute('type', `text`);
            inputElement.setAttribute('id', `ans-${i}`);
            inputElement.setAttribute('maxlength', `1`);
            inputElement.setAttribute('autocomplete',`off`)
            
            if (i==0){
                inputElement.setAttribute('placeholder', `_`);
                inputElement.style.borderColor ="rgba(103, 33, 113, 1)";
            }else{
                inputElement.setAttribute('disabled', ``);
                inputElement.setAttribute('placeholder', ``);
            }

            wordContainer.appendChild(wordElement); 
            inputContainer.appendChild(inputElement);
        };

        document.getElementById('ans-0').focus()
    
    } catch (error) {
      console.log('There has been a problem with your fetch operation:', error);
    }
};

inputContainer.addEventListener("input", (event) => {
    event.preventDefault();
    let ans = event.target.value.trim();

    if (ans === '') {
        return;
    }else{
        let ans_id = `ans-${y}`
        const input2 = document.getElementById(ans_id)
        if (ans.toLowerCase()==word[x]){
    
            if(x===word.length-1){
                win();
            }

            if(input2){
                input2.removeAttribute("disabled");
                input2.setAttribute('placeholder', `_`);
                input2.style.borderColor ="rgba(103, 33, 113, 1)";
                input2.focus();
            }

            let ans_id1 = `ans-${y-1}`
            const input1 = document.getElementById(ans_id1)
            input1.style.borderColor = "#4A5567";
            y += 1;
            x += 1;
        }
        else{
            navigator.vibrate(50)
            if (q<5){
                let dot_id = `dot-${q}`;
                document.getElementById(dot_id).style.backgroundColor = "rgba(103, 33, 113, 1)";
                document.getElementById("dot").textContent = `tries (${q} /5): `;
                let mistakeElement = document.createElement('span');
                mistakeElement.setAttribute('id', `mis-${q}`);
                mistakeElement.textContent = ans+",";
                mistakeContainer.appendChild(mistakeElement);
                q +=1;
            }
            else{
                dot_id = `dot-${q}`;
                document.getElementById("dot").textContent = `tries (${q} /5): `;
                document.getElementById(dot_id).style.backgroundColor = "rgba(103, 33, 113, 1)";
                mistakeElement = document.createElement('span');
                mistakeElement.setAttribute('id', `mis-${q}`);
                mistakeElement.textContent = ans;
                mistakeContainer.appendChild(mistakeElement);
                lose();
            }
        }
    }
});

function win() {
    confetti({
        particleCount: 200,
        spread: 70,
        origin: { x:1, y: 0.9 },
    });
    
    confetti({
        particleCount: 200,
        spread: 70,
        origin: { x:0, y: 0.9 },
    });

    document.getElementById('win-alert').style.display = 'flex';
    setTimeout(function() {location.reload();}, 5000);
};

function lose() {
    document.getElementById('lose-alert').style.display = 'flex';
    setTimeout(function() {location.reload();}, 5000);
};

randombtn.addEventListener("click", (event) =>{
    event.preventDefault();
    location.reload();
});

resetbtn.addEventListener("click", (event) =>{
    event.preventDefault();

    let w = 0;
    let e = 1;
    let inputDiv = document.getElementById('input');
    let inputs = inputDiv.getElementsByTagName('input');
    let allEmpty = true;
    
    for (let r = 0; r < inputs.length; r++) {
        if (inputs[r].value !== '') {
            allEmpty = false;
            break;
        }    
    }

    if (allEmpty && q == 1){
        document.getElementById('ans-0').focus();
        return;
    }else{
        while (w < inputs.length) {

            if (w > 0) {
                inputs[w].setAttribute('disabled', ``);
                inputs[w].setAttribute('placeholder', ``);
            }

            if (inputs[w].value != ''){
                inputs[w].value = '';
                w += 1;
            }else{
                break;
            }
        }
    }

    w -= 1;

    for (let t = 1; t <inputs.length; t++){
        let ans_id2 = `ans-${t}`;
        let ansElement = document.getElementById(ans_id2);
        if (ansElement.style.borderColor != "#4A5567") {
            ansElement.style.borderColor = "#4A5567";
            ansElement.setAttribute('disabled', ``);
        }else{
            break;
        }
    }

    let ans0Element = document.getElementById("ans-0");
    if (ans0Element) {
        ans0Element.style.borderColor = "rgba(103, 33, 113, 1)";
        ans0Element.focus();
    }

    document.getElementById("dot").textContent = `tries ( 0 /5)`;

    while (document.getElementById(`dot-${e}`) && document.getElementById(`dot-${e}`).style.backgroundColor !== "#4A5567") {
        let dotElement = document.getElementById(`dot-${e}`);
        let mis_id = `mis-${e}`;
        if (dotElement) {
            dotElement.style.backgroundColor = "#4A5567";
        }
        let mistakeElement = document.getElementById("mistake");
        if (mistakeElement && document.getElementById(mis_id)) {
            mistakeElement.removeChild(document.getElementById(mis_id));
        }
        e += 1;
    }

    q = 1;
    x = 0;
    y = 1;
    
});
    
showResponse();