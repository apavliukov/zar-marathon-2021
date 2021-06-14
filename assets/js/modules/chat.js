import utils from './utils.js';
import rules from './rules.js';

const logs = {
  start: 'Часы показывали [time], когда [player1] и [player2] бросили вызов друг другу.',
  end: [
    'Результат удара [playerWins]: [playerLose] - труп',
    '[playerLose] погиб от удара бойца [playerWins]',
    'Результат боя: [playerLose] - жертва, [playerWins] - убийца',
  ],
  hit: [
    '[playerDefence] пытался сконцентрироваться, но [playerKick] разбежавшись раздробил копчиком левое ухо врага.',
    '[playerDefence] расстроился, как вдруг, неожиданно [playerKick] случайно раздробил грудью грудину противника.',
    '[playerDefence] зажмурился, а в это время [playerKick], прослезившись, раздробил кулаком пах оппонента.',
    '[playerDefence] чесал <вырезано цензурой>, и внезапно неустрашимый [playerKick] отчаянно размозжил грудью левый бицепс оппонента.',
    '[playerDefence] задумался, но внезапно [playerKick] случайно влепил грубый удар копчиком в пояс оппонента.',
    '[playerDefence] ковырялся в зубах, но [playerKick] проснувшись влепил тяжелый удар пальцем в кадык врага.',
    '[playerDefence] вспомнил что-то важное, но внезапно [playerKick] зевнув, размозжил открытой ладонью челюсть противника.',
    '[playerDefence] осмотрелся, и в это время [playerKick] мимоходом раздробил стопой аппендикс соперника.',
    '[playerDefence] кашлянул, но внезапно [playerKick] показав палец, размозжил пальцем грудь соперника.',
    '[playerDefence] пытался что-то сказать, а жестокий [playerKick] проснувшись размозжил копчиком левую ногу противника.',
    '[playerDefence] забылся, как внезапно безумный [playerKick] со скуки, влепил удар коленом в левый бок соперника.',
    '[playerDefence] поперхнулся, а за это [playerKick] мимоходом раздробил коленом висок врага.',
    '[playerDefence] расстроился, а в это время наглый [playerKick] пошатнувшись размозжил копчиком губы оппонента.',
    '[playerDefence] осмотрелся, но внезапно [playerKick] робко размозжил коленом левый глаз противника.',
    '[playerDefence] осмотрелся, а [playerKick] вломил дробящий удар плечом, пробив блок, куда обычно не бьют оппонента.',
    '[playerDefence] ковырялся в зубах, как вдруг, неожиданно [playerKick] отчаянно размозжил плечом мышцы пресса оппонента.',
    '[playerDefence] пришел в себя, и в это время [playerKick] провел разбивающий удар кистью руки, пробив блок, в голень противника.',
    '[playerDefence] пошатнулся, а в это время [playerKick] хихикая влепил грубый удар открытой ладонью по бедрам врага.',
  ],
  defence: [
    '[playerKick] потерял момент и храбрый [playerDefence] отпрыгнул от удара открытой ладонью в ключицу.',
    '[playerKick] не контролировал ситуацию, и потому [playerDefence] поставил блок на удар пяткой в правую грудь.',
    '[playerKick] потерял момент и [playerDefence] поставил блок на удар коленом по селезенке.',
    '[playerKick] поскользнулся и задумчивый [playerDefence] поставил блок на тычок головой в бровь.',
    '[playerKick] старался провести удар, но непобедимый [playerDefence] ушел в сторону от удара копчиком прямо в пятку.',
    '[playerKick] обманулся и жестокий [playerDefence] блокировал удар стопой в солнечное сплетение.',
    '[playerKick] не думал о бое, потому расстроенный [playerDefence] отпрыгнул от удара кулаком куда обычно не бьют.',
    '[playerKick] обманулся и жестокий [playerDefence] блокировал удар стопой в солнечное сплетение.'
  ],
  draw: 'Ничья - это тоже победа!'
};

const $chat = document.querySelector('.chat');

function addLog(logType, player1Object = null, player2Object = null, lostHP = null) {
  if (!$chat) {
    return null;
  }

  const logString = prepareLogString(logType, player1Object, player2Object, lostHP);

  if (logString.length === 0) {
    return null;
  }

  $chat.insertAdjacentHTML('afterbegin', `<p>${logString}</p>`);
}

function prepareLogString(logType, player1Object, player2Object, lostHP) {
  const logTypeStrings = logs[logType];
  let logString = '';

  if (!logTypeStrings) {
    return logString;
  }

  const stringTemplate = Array.isArray(logTypeStrings) ? utils.getRandomArrayItem(logTypeStrings) : logTypeStrings;

  switch (logType) {
    case 'start':
      return prepareLogStart(stringTemplate, player1Object, player2Object);
    case 'end':
      return prepareLogEnd(stringTemplate, player1Object, player2Object);
    case 'hit':
      return prepareLogHit(stringTemplate, player1Object, player2Object, lostHP);
    case 'defence':
      return prepareLogDefence(stringTemplate, player1Object, player2Object);
    case 'draw':
      return prepareLogDraw(stringTemplate);
  }

  return logString;
}

function prepareLogStart(stringTemplate, player1Object, player2Object) {
  let logString = '';

  logString = stringReplacePlayerNames(stringTemplate, player1Object, player2Object);
  logString = stringReplaceTime(logString);

  return logString;
}

function prepareLogEnd(stringTemplate, player1Object, player2Object) {
  return stringReplacePlayerNames(stringTemplate, player1Object, player2Object);
}

function prepareLogHit(stringTemplate, player1Object, player2Object, lostHP) {
  const logTemplateHit = '[time] - [battleText] [lostHP] [totalHP]';
  let logString = '';

  logString = logTemplateHit.replace('[battleText]', stringReplacePlayerNames(stringTemplate, player1Object, player2Object));
  logString = stringReplaceTime(logString);
  logString = stringReplacePlayerLostHP(logString, lostHP);
  logString = stringReplacePlayerTotalHP(logString, player2Object);

  return logString;
}

function prepareLogDefence(stringTemplate, player1Object, player2Object) {
  const logTemplateDefence = '[time] - [battleText]';
  let logString = '';

  logString = logTemplateDefence.replace('[battleText]', stringReplacePlayerNames(stringTemplate, player1Object, player2Object));
  logString = stringReplaceTime(logString);

  return logString;
}

function prepareLogDraw(stringTemplate) {
  return stringTemplate;
}

function stringReplaceTime(stringTemplate) {
  return stringTemplate.replace('[time]', utils.getTimestamp());
}

/*
  We consider that the first player is always a hitter/winner, the second is a defender/loser
 */
function stringReplacePlayerNames(stringTemplate, player1Object, player2Object) {
  const player1Aliases = ['[player1]', '[playerWins]', '[playerKick]'];
  const player2Aliases = ['[player2]', '[playerLose]', '[playerDefence]'];

  for (let alias of player1Aliases) {
    stringTemplate = stringTemplate.replace(alias, player1Object.name);
  }

  for (let alias of player2Aliases) {
    stringTemplate = stringTemplate.replace(alias, player2Object.name);
  }

  return stringTemplate;
}

function stringReplacePlayerLostHP(stringTemplate, lostHP) {
  const stringLostHP = lostHP > 0 ? `-${lostHP}` : lostHP;

  return stringTemplate.replace('[lostHP]', stringLostHP);
}

function stringReplacePlayerTotalHP(stringTemplate, playerObject) {
  return stringTemplate.replace('[totalHP]', `[${playerObject.hp}/100]`);
}

function addGameStatusLog(gameObject) {
  if (gameObject.status === rules.STATUSES.draw) {
    addLog('draw');
  } else {
    addLog('end', gameObject.winner, gameObject.loser);
  }
}

export default { addLog, addGameStatusLog };