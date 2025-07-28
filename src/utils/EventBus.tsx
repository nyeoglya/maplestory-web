import mitt from 'mitt';

type GameEvents = {
  'captcha': void;
};

const emitter = mitt<GameEvents>();

export default emitter;
