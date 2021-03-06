'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _debounce = require('throttle-debounce/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _libs = require('../../../libs');

var _utils = require('../utils');

var _scrollbar = require('../../scrollbar');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function range(end) {
  var r = [];
  for (var i = 0; i < end; i++) {
    r.push(i);
  }
  return r;
}


var isNumber = function isNumber(value) {
  return typeof value === 'number';
};
var validateHour = function validateHour(value) {
  return isNumber(value) && value >= 0 && value <= 23;
};
var validateMinOrSec = function validateMinOrSec(value) {
  return isNumber(value) && value >= 0 && value <= 59;
};

function propsToState(props) {
  var hours = props.hours,
      minutes = props.minutes,
      seconds = props.seconds,
      selectableRange = props.selectableRange;

  var state = {};
  var setOnValid = function setOnValid(isValid, cb) {
    return isValid && cb(state);
  };
  setOnValid(validateHour(hours), function (state) {
    return state.hours = hours;
  });
  setOnValid(validateMinOrSec(minutes), function (state) {
    return state.minutes = minutes;
  });
  setOnValid(validateMinOrSec(seconds), function (state) {
    return state.seconds = seconds;
  });
  state.hoursList = (0, _utils.getRangeHours)(selectableRange);
  state.minutesLisit = range(60);
  state.secondsList = range(60);
  return state;
}

var SCROLL_AJUST_VALUE = 85;
var calcScrollTop = function calcScrollTop(value) {
  return Math.max(0, (value - 2.5) * 32 + SCROLL_AJUST_VALUE);
};

var TimeSpinner = function (_Component) {
  (0, _inherits3.default)(TimeSpinner, _Component);
  (0, _createClass3.default)(TimeSpinner, null, [{
    key: 'propTypes',
    get: function get() {
      return {
        hours: _libs.PropTypes.number,
        minutes: _libs.PropTypes.number,
        seconds: _libs.PropTypes.number,
        isShowSeconds: _libs.PropTypes.bool,
        //[[datefrom, dateend]...]
        selectableRange: _libs.PropTypes.arrayOf(_libs.PropTypes.arrayOf(_libs.PropTypes.instanceOf(Date))),
        /*
        type: one of [hours, minutes, seconds]
         onChange: ({type})=>()
        */
        onChange: _libs.PropTypes.func.isRequired,
        onSelectRangeChange: _libs.PropTypes.func
      };
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        isShowSeconds: true,
        onSelectRangeChange: function onSelectRangeChange() {}
      };
    }
  }]);

  function TimeSpinner(props) {
    (0, _classCallCheck3.default)(this, TimeSpinner);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TimeSpinner.__proto__ || Object.getPrototypeOf(TimeSpinner)).call(this, props));

    _this.state = {
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    Object.assign(_this.state, propsToState(props));
    _this.ajustScrollTop = _this._ajustScrollTop.bind(_this);
    _this.handleScroll = (0, _debounce2.default)(20, _this._handleScroll.bind(_this));
    return _this;
  }

  (0, _createClass3.default)(TimeSpinner, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.ajustScrollTop(this.state);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      this.setState(propsToState(nextProps), function () {
        _this2.ajustScrollTop(_this2.state);
      });
    }
  }, {
    key: 'emitSelectRange',
    value: function emitSelectRange(type) {
      var onSelectRangeChange = this.props.onSelectRangeChange;

      if (type === 'hours') {
        onSelectRangeChange(0, 3);
      } else if (type === 'minutes') {
        onSelectRangeChange(3, 5);
      } else if (type === 'seconds') {
        onSelectRangeChange(6, 9);
      }
    }
  }, {
    key: '_handleScroll',
    value: function _handleScroll(_type) {
      var value = Math.min(Math.floor((this.refs[_type].refs.wrap.scrollTop - SCROLL_AJUST_VALUE) / 32 + 3), 59);
      this.handleChange(_type, value);
    }

    // type: hours, minutes, seconds

  }, {
    key: 'handleChange',
    value: function handleChange(type, value, disabled) {
      var _this3 = this;

      if (disabled) return;
      this.state[type] = value;
      var changed = {};
      changed[type] = value;
      this.setState({}, function () {
        _this3.ajustScrollTop(_this3.state);
      });
      this.props.onChange(changed);
    }
  }, {
    key: '_ajustScrollTop',
    value: function _ajustScrollTop(_ref) {
      var hours = _ref.hours,
          minutes = _ref.minutes,
          seconds = _ref.seconds;

      if (hours != null) {
        this.refs.hours.refs.wrap.scrollTop = calcScrollTop(hours);
      }
      if (minutes != null) {
        this.refs.minutes.refs.wrap.scrollTop = calcScrollTop(minutes);
      }
      if (seconds != null) {
        this.refs.seconds.refs.wrap.scrollTop = calcScrollTop(seconds);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _state = this.state,
          hoursList = _state.hoursList,
          minutesLisit = _state.minutesLisit,
          secondsList = _state.secondsList,
          hours = _state.hours,
          minutes = _state.minutes,
          seconds = _state.seconds;
      var isShowSeconds = this.props.isShowSeconds;


      return _react2.default.createElement(
        'div',
        {
          className: this.classNames('el-time-spinner', {
            'has-seconds': isShowSeconds
          })
        },
        _react2.default.createElement(
          _scrollbar.Scrollbar,
          {
            onMouseEnter: function onMouseEnter() {
              return _this4.emitSelectRange('hours');
            },
            onWheel: function onWheel() {
              _this4.handleScroll('hours');
            },
            ref: 'hours',
            className: 'el-time-spinner__wrapper',
            wrapStyle: { maxHeight: 'inherit' },
            viewClass: 'el-time-spinner__list',
            viewComponent: 'ul'
          },
          hoursList.map(function (disabled, idx) {
            return _react2.default.createElement(
              'li',
              {
                key: idx,
                onClick: function onClick() {
                  return _this4.handleChange('hours', idx, disabled);
                },
                className: _this4.classNames('el-time-spinner__item', {
                  active: idx === hours,
                  disabled: disabled
                })
              },
              idx
            );
          })
        ),
        _react2.default.createElement(
          _scrollbar.Scrollbar,
          {
            onMouseEnter: function onMouseEnter() {
              return _this4.emitSelectRange('minutes');
            },
            onWheel: function onWheel() {
              return _this4.handleScroll('minutes');
            },
            ref: 'minutes',
            className: 'el-time-spinner__wrapper',
            wrapStyle: { maxHeight: 'inherit' },
            viewClass: 'el-time-spinner__list',
            viewComponent: 'ul'
          },
          minutesLisit.map(function (minute) {
            return _react2.default.createElement(
              'li',
              {
                key: minute,
                onClick: function onClick() {
                  return _this4.handleChange('minutes', minute);
                },
                className: _this4.classNames('el-time-spinner__item', {
                  active: minute === minutes
                })
              },
              minute
            );
          })
        ),
        isShowSeconds && _react2.default.createElement(
          _scrollbar.Scrollbar,
          {
            onMouseEnter: function onMouseEnter() {
              return _this4.emitSelectRange('seconds');
            },
            onWheel: function onWheel() {
              return _this4.handleScroll('seconds');
            },
            ref: 'seconds',
            className: 'el-time-spinner__wrapper',
            wrapStyle: { maxHeight: 'inherit' },
            viewClass: 'el-time-spinner__list',
            viewComponent: 'ul'
          },
          secondsList.map(function (sec) {
            return _react2.default.createElement(
              'li',
              {
                key: sec,
                onClick: function onClick() {
                  return _this4.handleChange('seconds', sec);
                },
                className: _this4.classNames('el-time-spinner__item', {
                  active: sec === seconds
                })
              },
              sec
            );
          })
        )
      );
    }
  }]);
  return TimeSpinner;
}(_libs.Component);

var _default = TimeSpinner;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(range, 'range', 'src/date-picker/basic/TimeSpinner.jsx');

  __REACT_HOT_LOADER__.register(isNumber, 'isNumber', 'src/date-picker/basic/TimeSpinner.jsx');

  __REACT_HOT_LOADER__.register(validateHour, 'validateHour', 'src/date-picker/basic/TimeSpinner.jsx');

  __REACT_HOT_LOADER__.register(validateMinOrSec, 'validateMinOrSec', 'src/date-picker/basic/TimeSpinner.jsx');

  __REACT_HOT_LOADER__.register(propsToState, 'propsToState', 'src/date-picker/basic/TimeSpinner.jsx');

  __REACT_HOT_LOADER__.register(SCROLL_AJUST_VALUE, 'SCROLL_AJUST_VALUE', 'src/date-picker/basic/TimeSpinner.jsx');

  __REACT_HOT_LOADER__.register(calcScrollTop, 'calcScrollTop', 'src/date-picker/basic/TimeSpinner.jsx');

  __REACT_HOT_LOADER__.register(TimeSpinner, 'TimeSpinner', 'src/date-picker/basic/TimeSpinner.jsx');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/date-picker/basic/TimeSpinner.jsx');
}();

;