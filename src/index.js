import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import throttle from 'lodash.throttle';
import cleanProps from 'clean-react-props';

class ScrollTrigger extends Component {
  constructor(props) {
    super(props);

    this.onScrollThrottled = throttle(this.onScroll.bind(this), props.throttleScroll, {
      trailing: false,
    });

    this.onResizeThrottled = throttle(this.onResize.bind(this), props.throttleResize, {
      trailing: false,
    });

    this.state = {
      inViewport: false,
      progress: 0,
      lastScrollPosition: null,
      lastScrollTime: null,
    };
  }

  componentDidMount() {
    addEventListener('resize', this.onResizeThrottled);
    addEventListener('scroll', this.onScrollThrottled);

    if (this.props.triggerOnLoad) {
      this.checkStatus();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.throttleScroll !== this.props.throttleScroll) {
      removeEventListener('scroll', this.onScrollThrottled);
      this.onScrollThrottled = throttle(this.onScroll.bind(this), this.props.throttleScroll, {
        trailing: false,
      });
      addEventListener('scroll', this.onScrollThrottled);
    }

    if (prevProps.throttleResize !== this.props.throttleResize) {
      removeEventListener('resize', this.onResizeThrottled);
      this.onResizeThrottled = throttle(this.onResize.bind(this), this.props.throttleResize, {
        trailing: false,
      });
      addEventListener('resize', this.onResizeThrottled);
    }
  }

  componentWillUnmount() {
    removeEventListener('resize', this.onResizeThrottled);
    removeEventListener('scroll', this.onScrollThrottled);
  }

  onResize() {
    this.checkStatus();
  }

  onScroll() {
    this.checkStatus();
  }

  checkStatus() {
    const {
      containerRef,
      onEnter,
      onExit,
      onProgress,
    } = this.props;

    const {
      lastScrollPosition,
      lastScrollTime,
    } = this.state;

    const element = ReactDOM.findDOMNode(this.element);
    const elementRect = element.getBoundingClientRect();
    const viewportStart = 0;
    const scrollingElement = typeof containerRef === 'string'
      ? document.querySelector(containerRef)
      : containerRef;
    const viewportEnd = containerRef === document.documentElement
      ? Math.max(containerRef.clientHeight, window.innerHeight || 0)
      : scrollingElement.clientHeight;
    const inViewport = elementRect.top <= viewportEnd && elementRect.bottom >= viewportStart;

    const position = window.scrollY;
    const velocity = lastScrollPosition && lastScrollTime
      ? Math.abs((lastScrollPosition - position) / (lastScrollTime - Date.now()))
      : null;

    if (inViewport) {
      const progress = Math.max(0, Math.min(1, 1 - (elementRect.bottom / (viewportEnd + elementRect.height))));

      if (!this.state.inViewport) {
        this.setState({
          inViewport,
        });

        onEnter({
          progress,
          velocity,
        }, this);
      }

      onProgress({
        progress,
        velocity,
      }, this);

      this.setState({
        lastScrollPosition: position,
        lastScrollTime: Date.now(),
      });
      return;
    }

    if (this.state.inViewport) {
      const progress = elementRect.top <= viewportEnd ? 1 : 0;

      this.setState({
        lastScrollPosition: position,
        lastScrollTime: Date.now(),
        inViewport,
        progress,
      });

      onProgress({
        progress,
        velocity,
      }, this);

      onExit({
        progress,
        velocity,
      }, this);
    }
  }

  render() {
    const {
      children,
      component,
    } = this.props;

    const elementMethod = React.isValidElement(component)
      ? 'cloneElement'
      : 'createElement';

    return React[elementMethod](component, {
        ...cleanProps(this.props, ['onProgress']),
        ref: (element) => {
          this.element = element;
        },
      },
      children,
    );
  }
}

ScrollTrigger.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
  ]),
  containerRef: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  throttleResize: PropTypes.number,
  throttleScroll: PropTypes.number,
  triggerOnLoad: PropTypes.bool,
  onEnter: PropTypes.func,
  onExit: PropTypes.func,
  onProgress: PropTypes.func,
};

ScrollTrigger.defaultProps = {
  component: 'div',
  containerRef: (typeof document !== 'undefined') ? document.documentElement : 'html',
  throttleResize: 100,
  throttleScroll: 100,
  triggerOnLoad: true,
  onEnter: () => {},
  onExit: () => {},
  onProgress: () => {},
};

export default ScrollTrigger;
