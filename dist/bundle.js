/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Converter = __webpack_require__(2)
const container = {}
class NumberToText {
  /**
  *  convert number to text
  *  @param {string or number} num
  *  @param {object } options { language : "en-us" ,separator :"," ,case : "titleCase" } current support languages en-us, en-in annd de and cases are "titleCase" , "lowerCase" , "upperCase". default is { language : "en-us" ,separator :"," ,case : "titleCase" }
  */
  constructor () {
    this.Converter = Converter
  }

  convertToText (num, options) {
    options = options || {}

    const language = (options.language || 'en-us').toLowerCase()
    if (Object.prototype.hasOwnProperty.call(container, language)) {
      return container[language].convertToText(num, options)
    } else {
      throw new Error('converter for language "' + language + '" not found.')
    }
  }

  addConverter (language, langConverter) {
    if (!Object.prototype.hasOwnProperty.call(container, language)) {
      if (langConverter instanceof Converter) {
        container[language] = langConverter
      } else {
        throw new Error('language converter is not instance of converter')
      }
    } else {
      return false
    }
  }
}

module.exports = new NumberToText()


/***/ }),
/* 2 */
/***/ ((module) => {

class Converter {
  convertToText (options) {
    throw new Error('convertToText is not implemented by ' + this.constructor.name + ' .')
  }
}
module.exports = Converter


/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const numberToText = __webpack_require__(1)

const thousands = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion']
const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
const cases = ['titleCase', 'lowerCase', 'upperCase']
const caseFunctions = [String.prototype.toString, String.prototype.toLowerCase, String.prototype.toUpperCase]

class EnUsConverter extends numberToText.Converter {
  constructor () {
    super()
    numberToText.addConverter('en-us', this)
  }

  convertToText (num, options) {
    options = options || {}
    if (options.separator !== '') options.separator = options.separator || ','
    if (cases.indexOf(options.case) === -1) {
      options.case = cases[0]
    }
    const caseFunction = caseFunctions[cases.indexOf(options.case)]

    const valueArray = []
    if (typeof num === 'number' || num instanceof Number) {
      num = num.toString()
    }
    if (num === '0') {
      return caseFunction.call('Zero')
    }
    const splittedNumbers = num.match(/.{1,}(?=(...){5}(...)$)|.{1,3}(?=(...){0,5}$)|.{1,3}$/g)
    for (let index = 0; index < splittedNumbers.length; ++index) {
      const splitValues = []
      const splitNum = splittedNumbers[index]
      if (splitNum.length > 3) {
        splitValues.push(module.exports.convertToText(splitNum))
      } else {
        if (splitNum.length === 3 && ones[splitNum.charAt(0)]) {
          splitValues.push(ones[splitNum.charAt(0)])
          splitValues.push('Hundred')
          if (ones[splitNum.charAt(1)] || ones[splitNum.charAt(2)]) splitValues.push('And')
          // if (ones[splitNum.charAt(1)] || ones[splitNum.charAt(2)]) splitValues.push('And')
        } if (splitNum.length >= 2) {
          if (splitNum.substr(-2, 1) === '1') {
            splitValues.push(ones[splitNum.substr(-2, 2)])
          } else {
            if (tens[splitNum.substr(-2, 1)]) {
              splitValues.push(tens[splitNum.substr(-2, 1)])
            }
            if (ones[splitNum.substr(-1, 1)]) {
              splitValues.push(ones[splitNum.substr(-1, 1)])
            }
          }
        } else {
          splitValues.push(ones[splitNum.charAt(0)])
        }
      }
      if (thousands[splittedNumbers.length - 1 - index] && splitValues.length > 0) {
        splitValues.push(thousands[splittedNumbers.length - 1 - index])
      }
      if (splitValues.length > 0) {
        valueArray.push(splitValues.join(' '))
      }
    }
    return caseFunction.call((valueArray.join(options.separator + ' ')))
  }
}

module.exports = new EnUsConverter()


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const numberToText = __webpack_require__(1);
__webpack_require__(3);

let wormLength = 3;
let wormSpeed = 150; //higher = slower
let maxWormSpeed = 30;
let width = 40;
let maxPixels = width * width;
let bodySegments = [724];
let mainGrid = document.getElementById("main_grid");
let failcheck = false;
let score = 0;

let hungerLevel = 100;

let pelletPos = 0;

let enemySegments = [1234];
let enemyWormLength = 6;

function main() {
  mainGrid.innerHTML = generatePixels(maxPixels);

  setTimeout(() => {
    wormUpdate();
    enemyWorm();
    hungerDecay();
  }, "10");
}

let buttonString = "ArrowRight";

function userInput() {
  document.addEventListener("keydown", (event) => {
    //console.log(`key=${event.key},code=${event.code}`);
    buttonString = event.key;
  });
} //test

function generatePixels(pixelCount) {
  let htmlString = "";
  let trackerNum = 1;
  let whiteArray = [
    /*371, 372, 373, 374, 375, 386, 387, 388, 389, 390, 410, 411, 412, 413, 414,
    415, 416, 425, 426, 427, 428, 429, 430, 431, 450, 451, 452, 453, 454, 455,
    456, 465, 466, 467, 468, 469, 470, 471, 490, 491, 492, 493, 494, 495, 496,
    505, 506, 507, 508, 509, 510, 511, 530, 531, 532, 533, 534, 535, 546, 547,
    547, 548, 549, 550, 551, 571, 572, 573, 574, 587, 588, 589, 590,*/
  ];
  for (var i = 0; i < pixelCount; i++) {
    if (whiteArray.includes(trackerNum)) {
      // htmlString += `<div class="pixel white">${trackerNum}</div>`;
      htmlString += `<div class="pixel white"></div>`;
    } else {
      //htmlString += `<div class="pixel">${trackerNum}</div>`;
      htmlString += `<div class="pixel"></div>`;
    }

    trackerNum++;
  }

  return htmlString;
}
let lastButton = "";
let direction = 1;

function wormUpdate() {
  if (
    document
      .querySelector(
        `.pixel:nth-child(${bodySegments[bodySegments.length - 1]})`
      )
      .classList.contains("black") ||
    document
      .querySelector(
        `.pixel:nth-child(${bodySegments[bodySegments.length - 1]})`
      )
      .classList.contains("enemy")
  ) {
    fail();
  } else if (
    document
      .querySelector(
        `.pixel:nth-child(${bodySegments[bodySegments.length - 1]})`
      )
      .classList.contains("pellet")
  ) {
    console.log("i eated a peller");
    hungerLevel += 14;
    if (hungerLevel > 100) {
      hungerLevel = 100;
    }
    readWord("cronch", 2, 0.9);
    score += 50;
    document
      .querySelector(
        `.pixel:nth-child(${bodySegments[bodySegments.length - 1]})`
      )
      .classList.remove("pellet");
    wormLength++;
    if (!(wormSpeed <= maxWormSpeed)) {
      wormSpeed--;
    }
    generatePellet();
  }

  bodySegments.forEach((seg) => {
    document.querySelector(`.pixel:nth-child(${seg})`).classList.add("black");
  });

  switch (buttonString) {
    case "ArrowLeft":
      if (!(lastButton == "ArrowRight")) {
        direction = -1;
        lastButton = buttonString;
      }
      break;
    case "ArrowRight":
      if (!(lastButton == "ArrowLeft")) {
        direction = 1;
        lastButton = buttonString;
      }
      break;
    case "ArrowUp":
      if (!(lastButton == "ArrowDown")) {
        direction = -width;
        lastButton = buttonString;
      }
      break;
    case "ArrowDown":
      if (!(lastButton == "ArrowUp")) {
        direction = width;
        lastButton = buttonString;
      }
      break;
    default:
      direction = 1;
  }

  changeDirection(direction, bodySegments, wormLength, "player");

  if (!failcheck) {
    setTimeout(() => {
      wormUpdate();
    }, wormSpeed);
  }
}

function generatePellet() {
  pelletPos = Math.floor(Math.random() * maxPixels);
  if (
    document
      .querySelector(`.pixel:nth-child(${pelletPos})`)
      .classList.contains("black") ||
    document
      .querySelector(`.pixel:nth-child(${pelletPos})`)
      .classList.contains("enemy")
  ) {
    generatePellet();
  } else {
    document
      .querySelector(`.pixel:nth-child(${pelletPos})`)
      .classList.add("pellet");
  }
}

function changeDirection(dir, bodyArray, length, type) {
  let lastArraySeg = bodyArray[bodyArray.length - 1];
  //console.log(lastArraySeg % 40);
  if (dir == 1) {
    if (lastArraySeg % width == 0 && !(lastArraySeg + dir) % width == 0) {
      bodyArray.push(bodyArray[bodyArray.length - 1] + dir - width);
    } else {
      bodyArray.push(bodyArray[bodyArray.length - 1] + dir);
    }
  } else if (dir == -1) {
    if ((lastArraySeg % width) - 1 == 0 && !(lastArraySeg - dir) % width == 0) {
      bodyArray.push(bodyArray[bodyArray.length - 1] + dir + width);
    } else {
      bodyArray.push(bodyArray[bodyArray.length - 1] + dir);
    }
  } else if (dir == width) {
    if (lastArraySeg + dir > maxPixels) {
      bodyArray.push(bodyArray[bodyArray.length - 1] + dir - maxPixels);
    } else {
      bodyArray.push(bodyArray[bodyArray.length - 1] + dir);
    }
  } else if (dir == -width) {
    if (lastArraySeg + dir <= 0) {
      bodyArray.push(bodyArray[bodyArray.length - 1] + dir + maxPixels);
    } else {
      bodyArray.push(bodyArray[bodyArray.length - 1] + dir);
    }
  }

  if (bodyArray.length - 1 === length) {
    if (type == "player") {
      document
        .querySelector(`.pixel:nth-child(${bodyArray[0]})`)
        .classList.remove("black");
    } else {
      document
        .querySelector(`.pixel:nth-child(${bodyArray[0]})`)
        .classList.remove("enemy");
    }
    bodyArray.shift();
  }
}

function updateScore() {
  if (!failcheck) {
    setTimeout(() => {
      document.getElementById("scoreText").innerHTML =
        numberToText.convertToText(score) + " Points";

      updateScore();
    }, "10");
  }
}
let enemyWormStop = false;
let enemyDir = -1;

function enemyWorm() {
  if (pelletPos < enemySegments[enemySegments.length - 1]) {
    enemyDir = -width;
  }
  let lastEnemySeg = enemySegments[enemySegments.length - 1];
  if (pelletPos < lastEnemySeg && lastEnemySeg > pelletPos + width) {
    enemyDir = -width;
  } else if (pelletPos > lastEnemySeg && lastEnemySeg < pelletPos + width) {
    enemyDir = width;
  } else if (pelletPos < lastEnemySeg && lastEnemySeg < pelletPos + width) {
    enemyDir = -1;
  } else if (
    (pelletPos > lastEnemySeg && lastEnemySeg < pelletPos + width) ||
    (pelletPos + width > 1600 && pelletPos - width < lastEnemySeg)
  ) {
    enemyDir = 1;
  }

  //console.log(pelletPos + "p " + lastEnemySeg);

  if (
    enemySegments[enemySegments.length - 1] + enemyDir < width * width &&
    document
      .querySelector(
        `.pixel:nth-child(${
          enemySegments[enemySegments.length - 1] + enemyDir
        })`
      )
      .classList.contains("black")
  ) {
    enemyWormStop = true;
  } else if (
    document
      .querySelector(
        `.pixel:nth-child(${enemySegments[enemySegments.length - 1]})`
      )
      .classList.contains("pellet")
  ) {
    document
      .querySelector(
        `.pixel:nth-child(${enemySegments[enemySegments.length - 1]})`
      )
      .classList.remove("pellet");
    readWord("munch", 3, 1.3);
    enemyWormLength++;

    // if (!(wormSpeed <= maxWormSpeed)) {
    //   wormSpeed--;
    // }
    generatePellet();
  } else {
    enemyWormStop = false;
  }

  enemySegments.forEach((seg) => {
    document.querySelector(`.pixel:nth-child(${seg})`).classList.add("enemy");
  });

  if (!enemyWormStop) {
    //enemyDir = 1;
    changeDirection(enemyDir, enemySegments, enemyWormLength, "enemy");
  } else {
    //enemyDir = 0;
  }
  setTimeout(() => {
    enemyWorm();
  }, "180");
}
function hunger() {
  var hungerBar = document.getElementById("wormFoodBar");
  hungerBar.style.width = hungerLevel + "%";

  if (hungerLevel <= 0) {
    fail();
  }
  setTimeout(() => {
    if (!failcheck) {
      hunger();
    }
  }, 10);
}
function setSpeech() {
  return new Promise(function (resolve, reject) {
    let synth = window.speechSynthesis;
    let id;

    id = setInterval(() => {
      if (synth.getVoices().length !== 0) {
        resolve(synth.getVoices());
        clearInterval(id);
      }
    }, 10);
  });
}

//fail();
function readWord(sampleWord, voiceIndex, voiceRate) {
  var speakWord = new SpeechSynthesisUtterance();

  let s = setSpeech();
  s.then(
    //(voices) => console.log(voices)
    function setVoice(voiceChosenWord) {
      speakWord.voice = voiceChosenWord[voiceIndex];
      //console.log(speakWord.voice);
      speakWord.volume = 1;
      speakWord.rate = voiceRate;
      speakWord.pitch = 3;
      speakWord.text = sampleWord;
      window.speechSynthesis.speak(speakWord);
    }
  );
}

function hungerDecay() {
  if (!failcheck) {
    hungerLevel--;
    if (hungerLevel == 25) {
      readWord("I am very hungry", 2, 0.8);
    }
    setTimeout(() => {
      hungerDecay();
    }, 500 - Math.floor(wormLength * 0.5));
  }
}
function fail() {
  hunger = 1;
  readWord("sorry! better luck nex time, cheeky fella", 7, 0.6);
  failcheck = true;
  document.querySelector(
    `.pixel:nth-child(${maxPixels / 2 - width / 2 - 3})`
  ).innerHTML = "F";
  document.querySelector(
    `.pixel:nth-child(${maxPixels / 2 - width / 2 - 2})`
  ).innerHTML = "A";
  document.querySelector(
    `.pixel:nth-child(${maxPixels / 2 - width / 2 - 1})`
  ).innerHTML = "I";
  document.querySelector(
    `.pixel:nth-child(${maxPixels / 2 - width / 2})`
  ).innerHTML = "L";
  document.querySelector(
    `.pixel:nth-child(${maxPixels / 2 - width / 2 + 1})`
  ).innerHTML = "E";
  document.querySelector(
    `.pixel:nth-child(${maxPixels / 2 - width / 2 + 2})`
  ).innerHTML = "D";
}

main();
userInput();
generatePellet();
updateScore();
hunger();

})();

/******/ })()
;