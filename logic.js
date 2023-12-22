const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyMessage = document.querySelector('[data-copyMsg]');
const dataCopy = document.querySelector('[data-copy]');
let passwordLength = document.querySelector('#lengthNumber');
const slider = document.querySelector('[data-lengthSlider]');
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector('#lowercase');
const numbers = document.querySelector('#numbers');
const specialSymbols = document.querySelector("#symbols");
const allCheck = document.querySelectorAll("input[type=checkbox]");
const strengthIndicator = document.querySelector('.strength-Indicator');
const generate = document.querySelector('.generatePassword');

let password = "";
let len = 10;
let checkCount = 1;

handleSlider(20); 
// slider function
function handleSlider(){
    slider.value=len;
    passwordLength.innerText = len;

    let mini = slider.min;
    let maxi = slider.max;

    slider.style.backgroundSize = ((len-mini)*100/(maxi-mini)) + "% 100%";
}

// setting the strength indicator
function setIndicator(color,shadow){
    strengthIndicator.style.backgroundColor = color;
    strengthIndicator.style.boxShadow = shadow;
}
// Generate a random value of integer, character, special symbols
function generateRandom(max,min){
    return Math.floor(Math.random()*(max-min) + min);
}

function generateRandomNumber(){
    return generateRandom(0,9);
}

function generateRandLowerCase(){
    return String.fromCharCode(generateRandom(97,123));
}

function generateRandUpperCase(){
    return String.fromCharCode(generateRandom(65,91));
}

const symbolArray = ["!","@","#","$","%","^","&","*","(",")","_","+","{","}","[","]",";",":","'","?","/","~"];
const symbolArrayLength = symbolArray.length;

function generateRandSymbol(){
    const randIdx = parseInt(generateRandom(0,symbolArrayLength));
    return symbolArray[randIdx];
}

function calStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasSymbol = false;
    let hasNumbers = false;
    
    if(uppercase.checked) hasUpper = true;
    if(lowercase.checked) hasLower = true;
    if(numbers.checked) hasNumbers = true;
    if(specialSymbols.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasSymbol || hasNumbers) && len >= 8){
        setIndicator('#0f0','0px 0px 20px rgba(0, 255, 0, 1)');
    }
    else if((hasUpper || hasLower) && hasNumbers && hasSymbol && len >= 8){
        setIndicator('#0f0','0px 0px 20px rgba(0, 255, 0, 1)');
    }
    else if(hasUpper && hasLower && (hasSymbol || hasNumbers) && len <= 8 && len >=6){
        setIndicator('#ff0','0 0 10px rgba(255, 255, 0, 1)');
    }
    else if(hasUpper && hasLower && len >= 12){
        setIndicator('#0f0','0px 0px 20px rgba(0, 255, 0, 1)');
    }
    else if(hasUpper && hasLower && len >=7 && len <=11){
        setIndicator('#ff0','0 0 10px rgba(255, 255, 0, 1)');
    }
    else if((hasSymbol && hasLower && len >= 8 && len<=10) || (len >=15 && len <= 20)){
        setIndicator('#ff0','0 0 10px rgba(255, 255, 0, 1)')
    }
    else{
        setIndicator('#f00','0 0 10px rgba(255, 0, 0, 1)');
    }
}

// Copy the password function

async function copyFunction(){
    let content = passwordDisplay.value;
    try{
        await navigator.clipboard.writeText(content);
        copyMessage.textContent = "Copied";
    }
    catch(e){
        window.alert("Failed to Copy the password",e);
        copyMessage.textContent = "Failed";
    }

    copyMessage.classList.add('copyButton');

    setTimeout(()=>{
        copyMessage.textContent = "";
        copyMessage.classList.remove('copyButton');
    },2000);
    
}

dataCopy.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyFunction();
    }
});



slider.addEventListener('input' , (e) => {
    len = e.target.value;
    handleSlider();
})

// Main Logic

// Update Check Count

// event listener on uppercase

allCheck.forEach((element) => {
    element.addEventListener('change',(e) => {
        if(e.target.checked){
            checkCount++;
        }
        else{
            checkCount--;
        }
    });
});

generate.addEventListener('click',() => {
    if(checkCount == 0){
        window.alert('Please Check atleast One Option');
        return;
    }

    if(checkCount > len){
        len = checkCount;
        handleSlider();
    }

    password = "";

    const funcArray = [];
    if(uppercase.checked){
        funcArray.push(generateRandUpperCase);
    }

    if(lowercase.checked){
        funcArray.push(generateRandLowerCase);
    }

    
    if(numbers.checked){
        funcArray.push(generateRandomNumber);
    }

    
    if(specialSymbols.checked){
        funcArray.push(generateRandSymbol);
    }

    for(let i = 1 ; i<=len ; i++){
        let randIdx = generateRandom(0,funcArray.length);
        
        password += funcArray[randIdx]();
    }

    // Now Calculate the strength of the password

    passwordDisplay.value = password;
    calStrength();
});
