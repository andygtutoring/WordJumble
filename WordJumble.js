// WordJumble.js
// Quotes and word banks
const quotes = [
  {
    quote: "To be or not to be that is the question",
    words: ["To", "be", "or", "not", "to", "be", "that", "is", "the", "question", "answer", "life"]
  },
  {
    quote: "The quick brown fox jumps over the lazy dog",
    words: ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog", "sun", "moon", "car"]
  },
  // Add more quotes here
];

let currentQuote = 0;
let score = 0;

// Initialize game
function initGame() {
  const quoteContainer = document.getElementById("quote");
  const wordBankContainer = document.getElementById("word-bank-container");
  const submitBtn = document.getElementById("submit-btn");
  const result = document.getElementById("result");
  const scoreElement = document.getElementById("score");

  // Set up event listeners
  submitBtn.addEventListener("click", checkAnswer);
  wordBankContainer.addEventListener("click", selectWord);
  quoteContainer.addEventListener("click", selectWord);

  // Load first quote
  loadQuote();
}

// Load quote and word bank
function loadQuote() {
  const quoteContainer = document.getElementById("quote");
  const wordBankContainer = document.getElementById("word-bank-container");

  // Clear previous quote and word bank
  quoteContainer.innerHTML = "";
  wordBankContainer.innerHTML = "";

  // Set up quote
  const quoteWords = quotes[currentQuote].quote.split(" ");
  for (let i = 0; i < quoteWords.length; i++) {
    const span = document.createElement("span");
    span.textContent = "";
    quoteContainer.appendChild(span);
  }

  // Shuffle word bank
  const wordBank = [...quotes[currentQuote].words]; 
  shuffle(wordBank);

  // Set up word bank
  for (let i = 0; i < wordBank.length; i++) {
    const wordDiv = document.createElement("div");
    wordDiv.textContent = wordBank[i];
    wordDiv.classList.add("word-bank-word"); // Add class for word bank words
    wordBankContainer.appendChild(wordDiv);
  }
}

// Select word from word bank or quote
function selectWord(event) {
  if (event.target.tagName === "SPAN" && event.target.parentElement.id === "quote") {
    // Return word to word bank
    const selectedWord = event.target.textContent;
    const wordElement = document.createElement("span");
    wordElement.textContent = selectedWord;
    wordElement.classList.add("floating-word");
    wordElement.style.top = `${event.target.getBoundingClientRect().top}px`;
    wordElement.style.left = `${event.target.getBoundingClientRect().left}px`;
    wordElement.style.setProperty("--start-top", `${event.target.getBoundingClientRect().top}px`);
    wordElement.style.setProperty("--start-left", `${event.target.getBoundingClientRect().left}px`);

    // Find the target position in the word bank
    const wordBankContainer = document.getElementById("word-bank-container");
    const wordBankWords = wordBankContainer.children;
    for (let i = 0; i < wordBankWords.length; i++) {
      if (wordBankWords[i].textContent === selectedWord && wordBankWords[i].classList.contains("selected")) {
        const targetPosition = wordBankWords[i].getBoundingClientRect();
        wordElement.style.setProperty("--target-top", `${targetPosition.top}px`);
        wordElement.style.setProperty("--target-left", `${targetPosition.left}px`);
        break;
      }
    }

    document.body.appendChild(wordElement);
    wordElement.style.animationName = "return-to-bank";
    
    wordElement.addEventListener("animationend", () => {
      wordElement.remove();
      event.target.textContent = "";
      const wordBankContainer = document.getElementById("word-bank-container");
      const wordBankWords = wordBankContainer.children;
      for (let i = 0; i < wordBankWords.length; i++) {
        if (wordBankWords[i].textContent === selectedWord) {
          wordBankWords[i].classList.remove("selected");
        }
      }
    });
  } else if (event.target.tagName === "DIV" && event.target.classList.contains("word-bank-word") && !event.target.classList.contains("selected")) {
    // Add word to quote
    const selectedWord = event.target.textContent;
    const quoteContainer = document.getElementById("quote");
    const spans = quoteContainer.children;

    // Find the first empty span in the quote
    for (let i = 0; i < spans.length; i++) {
      if (spans[i].textContent === "") {
        spans[i].textContent = selectedWord;
        event.target.classList.add("selected");

        // Create a temporary floating word element
        const wordElement = document.createElement("span");
        wordElement.textContent = selectedWord;
        wordElement.classList.add("floating-word");
        wordElement.style.top = `${event.target.getBoundingClientRect().top}px`;
        wordElement.style.left = `${event.target.getBoundingClientRect().left}px`;
        wordElement.style.setProperty("--start-top", `${event.target.getBoundingClientRect().top}px`);
        wordElement.style.setProperty("--start-left", `${event.target.getBoundingClientRect().left}px`);
        wordElement.style.setProperty("--target-top", `${spans[i].getBoundingClientRect().top}px`);
        wordElement.style.setProperty("--target-left", `${spans[i].getBoundingClientRect().left}px`);
        document.body.appendChild(wordElement);
        wordElement.style.animationName = "float-to-quote";

        wordElement.addEventListener("animationend", () => {
          wordElement.remove();
        });
        break;
      }
    }
  }
}

// Check answer
function checkAnswer() {
  const quoteContainer = document.getElementById("quote");
  const spans = quoteContainer.children;
  const quoteWords = quotes[currentQuote].quote.split(" ");
  let correct = true;

  for (let i = 0; i < spans.length; i++) {
    if (spans[i].textContent !== quoteWords[i]) {
      spans[i].classList.add("incorrect");
      correct = false;
    } else {
      spans[i].classList.add("correct");
    }
  }

  if (correct) {
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("result").textContent = "Correct!";
    setTimeout(nextQuote, 2000);
  } else {
    document.getElementById("result").textContent = "Incorrect!";
  }
}

// Load next quote
function nextQuote() {
  const wordBankContainer = document.getElementById("word-bank-container");
  const quoteContainer = document.getElementById("quote");

  // Remove selected class from word bank
  const wordDivs = wordBankContainer.children;
  for (let i = 0; i < wordDivs.length; i++) {
    wordDivs[i].classList.remove("selected");
  }

  // Remove correct and incorrect classes from quote
  const spans = quoteContainer.children;
  for (let i = 0; i < spans.length; i++) {
    spans[i].classList.remove("correct", "incorrect");
    spans[i].textContent = "";
  }

  currentQuote = (currentQuote + 1) % quotes.length;
  loadQuote();
}

// Fisher-Yates shuffle function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

initGame();

