document.addEventListener('DOMContentLoaded', function() {
  const display = document.getElementById('displayDiv');
  const wordsDiv = document.getElementById('words');

  let i = 0;
  let interval;

  let words = [];
  let texts = [];

  let currentWord;
  let currentWordText;

  async function fetchNewWord(){
    try {
      let response = await fetch('/getNewWord');
      let data = await response.json();
      return data;
    } catch(error){
      console.error('Error fetching data: ', error);
    }
  }

  async function storeWord(){
    let data = await fetchNewWord();
    if (data) {
      let worddiv = document.createElement('div');
      worddiv.id = 'word';
      for (let char of data.word){
        let span = document.createElement('span');
        span.textContent = char;
        worddiv.appendChild(span);
      }
      words.push(worddiv);
      texts.push(data.word);
    }
  }

  function playWord(){
    currentWord = words.pop();
    currentWordText = texts.pop();
    wordsDiv.appendChild(currentWord);
    startSliding(currentWord);
    i = 0;
  }

  function clearWord(wordDiv){
    wordsDiv.removeChild(wordDiv);
    display.textContent = '';
  }

  function startSliding(wordDiv){
    wordDiv.style.left = '0px';
    clearInterval(interval);
    interval = setInterval(() => {
      let currentLeft = parseInt(window.getComputedStyle(wordDiv).left);
      let newLeft = currentLeft + 20;
      wordDiv.style.left = newLeft + 'px';
      if (newLeft > window.innerWidth/2){
        clearInterval(interval);
        alert('You lose! You took too long');
      }
    }, 100)
  }



  async function startGame(){
    for (let index = 0; index < 3; index++) {
      await storeWord();
    }
    playWord();
    console.log(words.length);
  }

  startGame();

  document.addEventListener('keydown', function(event){
    const key = event.key;
    if (key.length == 1 && currentWordText[i] === key){
      display.textContent += key;
      currentWord.children[i].classList.add('correct');
      i += 1;
    }
    if (display.textContent === currentWordText){
      console.log('Done');
      clearInterval(interval);
      clearWord(currentWord);
      if (words.length/2 < 2){
        console.log("Restarting...");
        startGame();
      } else {
        playWord();
      }
    }
  });
});
