historicalGuesses = [['0000']];
possibles = [];

function getNumStr(num) {
  var s = num + "";
  while (s.length < 4) s = "0" + s;
  return s;
}

function resetPossibles() {
  for (var i = 0; i <= 9999; i++) {
    possibles.push(getNumStr(i));
  }
}

resetPossibles();

class ComputerPanel extends React.Component {
  render() {
    return (
      React.createElement("div", null, "I guess...",

      React.createElement("ul", { class: "collection" }, React.createElement(Guess, { historicalGuesses: this.props.historicalGuesses }))));

  }}


class Guess extends React.Component {
  render() {
    let lists = [];
    this.props.historicalGuesses.forEach(x => {
      lists.push(React.createElement("li", { class: "collection-item" }, x[0],
      React.createElement("span", { class: "right" }, x[1])));

    });
    return lists;
  }}



var render = () => {
  ReactDOM.render(React.createElement(ComputerPanel, { historicalGuesses: historicalGuesses }), document.getElementById('computer-panel'));
};

var validateInput = hints => {
  if (hints.length != 4 || hints[1] !== 'A' || hints[3] !== 'B' || !/[0-9]/.test(hints[0]) || !/[0-9]/.test(hints[2])) {
    alert('invalid input, should be in format _A_B');
    return false;
  }
  if (hints === '4A0B') {
    alert(`End Game, total tried: ${historicalGuesses.length} times`);
    return false;
  }
  return true;
};

var run = hints => {
  var nextGuess = guessNum(hints);
  historicalGuesses.push([nextGuess]);
  render();
};

$('#start-btn').click(() => {
  hints = $('#number-input').val();
  if (!validateInput(hints)) return;
  historicalGuesses[historicalGuesses.length - 1].push(hints);
  run(hints);
  $('#number-input').val('');
});

$('#reset-btn').click(() => {
  historicalGuesses = [['0000']];
  possibles = [];
  resetPossibles();
  render();
});

render();

function updatePossibles(guess, previousA, previousB, possibles) {
  var res = [];
  for (k = 0; k < possibles.length; k++) {
    var [A, B] = getHint(possibles[k], guess);
    if (A == previousA && B == previousB) {
      res.push(possibles[k]);
    }
  }
  return res;
}

function guessNum(hints) {
  var guess = historicalGuesses[historicalGuesses.length - 1][0];
  var previousA = Number(hints[0]);
  var previousB = Number(hints[2]);
  possibles = updatePossibles(guess, previousA, previousB, possibles);
  if (possibles.length == 0) {
    alert('A wrong hint has been given');
  }
  return possibles[Math.floor(Math.random() * possibles.length)];
}


function getHint(secret, guess) {
  var map = {};
  var A = 0;
  var B = 0;
  for (i = 0; i < 10; i++) map[i] = 0;
  for (i = 0; i < secret.length; i++) {
    if (secret[i] === guess[i]) A++;else
    {
      map[secret[i]]++;
      B += map[secret[i]] <= 0 ? 1 : 0;
      map[guess[i]]--;
      B += map[guess[i]] >= 0 ? 1 : 0;
    }
  }
  return [A, B];
}