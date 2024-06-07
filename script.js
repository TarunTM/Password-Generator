// display container
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

// input container
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");

const symbols ='~`!@#$%^&*()_-=+{[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 1;

handleSlider();

setIndicator("#ccc");


function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // slider color till thumb
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100/ (max - min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol() {
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >=6) {
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText ="Failed";
    }
    // to make visivle span tag
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener('input' , () =>{
    passwordLength = inputSlider.value;
    handleSlider();
})

copyBtn.addEventListener('click' , () => {
    if(passwordDisplay.value)
        {
            copyContent();
        }
})

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach( (checkbox) =>{
        if(checkbox.checked)
            checkCount++;
    });

    // checkbox count is greater than length of password
    //  if(passwordLength < checkCount){
    //     passwordLength = checkCount;
    //     handleSlider();
    // }
    
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

function shufflePassword(array) {
    // fisher yates method 
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] =array[j];
        array[j] = temp;
    }
    let str ="";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click' , () => {
    // none selected
    if(checkCount ==0) 
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    
    password = "";

    let funcArr = [];
    
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);   

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition of checked box
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    

    // remaining password
    for( let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex =getRndInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }
    
    // shuffle password
    password = shufflePassword(Array.from(password));
    
    // display in UI
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();
})
    