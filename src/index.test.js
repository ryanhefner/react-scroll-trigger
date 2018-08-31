import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import throttle from 'lodash.throttle';
import ScrollTrigger from './index';
import TestComponent from '../tools/TestComponent';

Enzyme.configure({
  adapter: new Adapter(),
});

let component;

describe('<ScrollTrigger />', () => {
  beforeEach(() => {
    window.Element.prototype.getBoundingClientRect = () => {
      return {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    };
  });

  test('ScrollTrigger should render a div', () => {
    component = mount(<ScrollTrigger />, {
      attachTo: document.getElementById('root'),
    });
    expect(component.contains(<div></div>)).toBe(true);
    component.unmount();
  });

  test('ScrollTrigger should render a specified component', () => {
    component = mount(<ScrollTrigger component="section" />, {
      attachTo: document.getElementById('root'),
    });
    expect(component.contains(<section></section>)).toBe(true);
    component.unmount();
  });

  test('ScrollTrigger should render an element passed into component', () => {
    component = mount(<ScrollTrigger component={<TestComponent />} />, {
      attachTo: document.getElementById('root'),
    });
    expect(component.contains(<section></section>)).toBe(true);
    component.unmount();
  });

  test('ScrollTrigger should render an element passed into component with children', () => {
    component = mount(<ScrollTrigger component={<TestComponent />}><div></div></ScrollTrigger>, {
      attachTo: document.getElementById('root'),
    });
    expect(component.contains(<section><div></div></section>)).toBe(true);
    component.unmount();
  });

  test('ScrollTrigger fires onEnter when loaded', () => {
    let onEnterFired = false;
    const onEnter = () => {
      onEnterFired = true;
    };
    component = mount(<ScrollTrigger onEnter={onEnter} />, {
      attachTo: document.getElementById('root'),
    });
    expect(onEnterFired).toBe(true);
    component.unmount();
  });

  test('ScrollTrigger _does not_ fire onEnter when loaded with triggerOnLoad = false', () => {
    let onEnterFired = false;
    const onEnter = () => {
      onEnterFired = true;
    };
    component = mount(<ScrollTrigger onEnter={onEnter} triggerOnLoad={false} />, {
      attachTo: document.getElementById('root'),
    });
    expect(onEnterFired).toBe(false);
    component.unmount();
  });

  test('ScrollTrigger _does not_ fire onEnter when loaded outside of viewport', () => {
    window.resizeTo(1024, 768);
    window.Element.prototype.getBoundingClientRect = () => {
      return {
        left: 0,
        top: 1572,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    };

    let onEnterFired = false;
    const onEnter = () => {
      onEnterFired = true;
    };

    component = mount(<ScrollTrigger onEnter={onEnter} />, {
      attachTo: document.getElementById('root'),
    });

    expect(onEnterFired).toBe(false);
    component.unmount();
  });

  test('ScrollTrigger fires onEnter callback when entering viewport', () => {
    window.resizeTo(1024, 768);
    window.Element.prototype.getBoundingClientRect = () => {
      return {
        left: 0,
        top: 1572,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    };

    let onEnterFired = false;
    const onEnter = () => {
      onEnterFired = true;
    };

    component = mount(<ScrollTrigger onEnter={onEnter} />, {
      attachTo: document.getElementById('root'),
    });

    window.Element.prototype.getBoundingClientRect = () => {
      return {
        left: 0,
        top: 767,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    };
    window.scrollTo(0, 768);

    expect(onEnterFired).toBe(true);
    component.unmount();
  });

  test('ScrollTrigger fires onExit callback when exiting viewport', () => {
    window.resizeTo(1024, 768);

    let onExitFired = false;
    const onExit = () => {
      onExitFired = true;
    };

    component = mount(<ScrollTrigger onExit={onExit} />, {
      attachTo: document.getElementById('root'),
    });

    window.Element.prototype.getBoundingClientRect = () => {
      return {
        left: 0,
        top: -2,
        right: 0,
        bottom: -1,
        x: 0,
        y: 0,
        width: 0,
        height: 1,
      };
    };

    window.scrollTo(0, 769);

    expect(onExitFired).toBe(true);
    component.unmount();
  });

  test('ScrollTrigger fires onProgress callback while scrolling through viewport', () => {
    window.resizeTo(1024, 768);

    let onProgressInitial = true;
    let onProgressCount = 0;
    const onProgress = () => {
      if (!onProgressInitial) {
        onProgressCount++;
      }

      onProgressInitial = false;
    };

    component = mount(<ScrollTrigger onProgress={onProgress} throttleScroll={0} />, {
      attachTo: document.getElementById('root'),
    });

    window.scrollTo(1, 0);
    window.scrollTo(2, 0);

    expect(onProgressCount).toBe(2);
    component.unmount();
  });

  test('ScrollTrigger only fires onProgress once due to throttleScroll value', () => {
    window.resizeTo(1024, 768);

    let onProgressInitial = true;
    let onProgressCount = 0;
    const onProgress = () => {
      if (!onProgressInitial) {
        onProgressCount++;
      }

      onProgressInitial = false;
    };

    component = mount(<ScrollTrigger onProgress={onProgress} />, {
      attachTo: document.getElementById('root'),
    });

    window.scrollTo(1, 0);
    window.scrollTo(2, 0);

    expect(onProgressCount).toBe(1);
    component.unmount();
  });

  test('ScrollTrigger fires onProgress callback when browser is resized', () => {
    window.resizeTo(1024, 768);

    let onProgressFired = false;
    const onProgress = () => {
      onProgressFired = true;
    };

    component = mount(<ScrollTrigger onProgress={onProgress} />, {
      attachTo: document.getElementById('root'),
    });

    window.resizeTo(320, 568);

    expect(onProgressFired).toBe(true);
    component.unmount();
  });

  test('ScrollTrigger properly accepts throttleScroll prop change and updates accordingly', () => {
    component = mount(<ScrollTrigger />, {
      attachTo: document.getElementById('root'),
    });

    component.setProps({
      throttleScroll: 0,
    });

    expect(component.prop('throttleScroll')).toEqual(0);
    component.unmount();
  });

  test('ScrollTrigger properly accepts throttleResize prop change and updates accordingly', () => {
    component = mount(<ScrollTrigger />, {
      attachTo: document.getElementById('root'),
    });

    component.setProps({
      throttleResize: 0,
    });

    expect(component.prop('throttleResize')).toEqual(0);
    component.unmount();
  });
});
