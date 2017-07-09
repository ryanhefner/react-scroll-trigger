var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import omit from 'lodash/omit';
import throttle from 'lodash/throttle';

var ScrollTrigger = function (_Component) {
  _inherits(ScrollTrigger, _Component);

  function ScrollTrigger(props) {
    _classCallCheck(this, ScrollTrigger);

    var _this = _possibleConstructorReturn(this, (ScrollTrigger.__proto__ || Object.getPrototypeOf(ScrollTrigger)).call(this, props));

    _this.onScroll = throttle(_this.onScroll.bind(_this), 100, {
      trailing: false
    });

    _this.onResize = throttle(_this.onResize.bind(_this), 100, {
      trailing: false
    });

    _this.state = {
      inViewport: false,
      progress: 0,
      lastScrollPosition: null,
      lastScrollTime: null
    };
    return _this;
  }

  _createClass(ScrollTrigger, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      addEventListener('resize', this.onResize);
      addEventListener('scroll', this.onScroll);

      if (this.props.triggerOnLoad) {
        this.checkStatus();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      removeEventListener('resize', this.onResize);
      removeEventListener('scroll', this.onScroll);
    }
  }, {
    key: 'onResize',
    value: function onResize() {
      this.checkStatus();
    }
  }, {
    key: 'onScroll',
    value: function onScroll() {
      this.checkStatus();
    }
  }, {
    key: 'checkStatus',
    value: function checkStatus() {
      var _props = this.props,
          onEnter = _props.onEnter,
          onExit = _props.onExit,
          onProgress = _props.onProgress;
      var _state = this.state,
          lastScrollPosition = _state.lastScrollPosition,
          lastScrollTime = _state.lastScrollTime;


      var element = ReactDOM.findDOMNode(this.element);
      var elementRect = element.getBoundingClientRect();
      var viewportStart = 0;
      var viewportEnd = document.body.clientHeight;
      var inViewport = elementRect.top < viewportEnd && elementRect.bottom > viewportStart;

      var position = window.scrollY;
      var velocity = lastScrollPosition && lastScrollTime ? Math.abs((lastScrollPosition - position) / (lastScrollTime - Date.now())) : null;

      if (inViewport) {
        var progress = Math.max(0, Math.min(1, 1 - elementRect.bottom / (viewportEnd + elementRect.height)));

        if (!this.state.inViewPort) {
          this.setState({
            inViewport: inViewport
          });

          onEnter({
            progress: progress,
            velocity: velocity
          }, this);
        }

        this.setState({
          lastScrollPosition: position,
          lastScrollTime: Date.now()
        });

        onProgress({
          progress: progress,
          velocity: velocity
        }, this);
        return;
      }

      if (this.state.inViewport) {
        var _progress = elementRect.top <= viewportEnd ? 1 : 0;

        this.setState({
          lastScrollPosition: position,
          lastScrollTime: Date.now(),
          inViewport: inViewport,
          progress: _progress
        });

        onProgress({
          progress: _progress,
          velocity: velocity
        }, this);

        onExit({
          progress: _progress,
          velocity: velocity
        }, this);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var children = this.props.children;


      var props = omit(this.props, ['onEnter', 'onExit', 'onProgress', 'triggerOnLoad']);

      return React.createElement(
        'div',
        _extends({}, props, {
          ref: function ref(element) {
            _this2.element = element;
          }
        }),
        children
      );
    }
  }]);

  return ScrollTrigger;
}(Component);

ScrollTrigger.propTypes = {
  triggerOnLoad: PropTypes.bool,
  onEnter: PropTypes.func,
  onExit: PropTypes.func,
  onProgress: PropTypes.func
};

ScrollTrigger.defaultProps = {
  triggerOnLoad: true,
  onEnter: function onEnter() {},
  onExit: function onExit() {},
  onProgress: function onProgress() {}
};

export default ScrollTrigger;