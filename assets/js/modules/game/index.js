import utils from '../utils';
import rules from '../rules';
import battle from '../battle';
import Player from '../player';
import Arena from '../arena';
import Chat from '../chat';

class Game {
  constructor(props) {
    this.status = rules.STATUSES.start;
    this.players = {};
    this.winner = null;
    this.loser = null;
    this.arena = null;
    this.chat = null;
  }

  init = () => {
    this.createPlayers();
    this.arena = new Arena({
      selector: '.arenas'
    });
    this.chat = new Chat({
      selector: '.chat'
    });

    return this;
  };

  start = () => {
    this.init();
    this.setupArena();

    return this;
  };

  changeStatus = (status) => {
    this.status = status;

    return this;
  };

  setWinner = (player) => {
    this.winner = player;

    return this;
  };

  setLoser = (player) => {
    this.loser = player;

    return this;
  };

  createPlayers = () => {
    const player1 = new Player({
      number: 1,
      name: 'Sub-Zero',
      imgIndex: 'sub-zero',
      weapon: ['sword', 'axe', 'dagger'],
    });
    const player2 = new Player({
      number: 2,
      name: 'Sonya Blade',
      imgIndex: 'sonya-blade',
      weapon: ['hammer', 'knife', 'bow'],
    });

    this.players = {
      player1,
      player2
    };

    return this;
  };

  setupArena = () => {
    if (!this.arena.elementExists()) {
      return null;
    }

    this.arena.drawArena(this.players);
    this.chat.addLog('start', this.players.player1, this.players.player2);
    this.handleFightFormSubmit(this.arena);

    return this;
  };

  checkGameOver = ($form) => {
    this.checkGameStatus();

    if (this.isGameRunning()) {
      return false;
    }

    utils.hideElement($form);
    this.chat.addGameStatusLog(this);
    this.arena.appendGameStatusLabel(this);
    this.arena.appendReloadButton();

    return true;
  };

  /**
   * Returns the winning player if the game is over, string if draw or false if the game continues
   */
  checkGameStatus = () => {
    const { player1, player2 } = this.players;

    if (player1.hp === 0 && player2.hp !== 0) {
      this.changeStatus(rules.STATUSES.winner).setWinner(player2).setLoser(player1);
      player1.changeState(rules.PLAYER_STATES.loser);
      player2.changeState(rules.PLAYER_STATES.winner);
    }

    if (player2.hp === 0 && player1.hp !== 0) {
      this.changeStatus(rules.STATUSES.winner).setWinner(player1).setLoser(player2);
      player1.changeState(rules.PLAYER_STATES.winner);
      player2.changeState(rules.PLAYER_STATES.loser);
    }

    if (player1.hp === 0 && player2.hp === 0) {
      this.changeStatus(rules.STATUSES.draw);
    }

    return this;
  };

  isGameRunning = () => {
    return [rules.STATUSES.start, rules.STATUSES.running].indexOf(this.status) > -1;
  };

  handleFightFormSubmit = () => {
    const $formFight = document.querySelector('.control');

    if (!$formFight) {
      return null;
    }

    $formFight.addEventListener('submit', (event) => {
      event.preventDefault();

      const formValues = utils.getFormValues($formFight);

      battle.handleBattleRound(this.chat, this.players, formValues);
      utils.resetFormValues($formFight);
      this.checkGameOver($formFight);
      this.changeStatus(rules.STATUSES.running);
    });

    return this;
  };
}

export default Game;