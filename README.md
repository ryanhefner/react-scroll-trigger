# react-scroll-trigger

React component that monitors `scroll` events to trigger callbacks when it enters,
exits and progresses through the viewport. All callback include the `progress` and
`velocity` of the scrolling, in the event you want to manipulate stuff based on
those values.

## Install

Via [npm](https://npmjs.com/package/react-scroll-trigger)

```sh
npm install react-scroll-trigger
```

Via [Yarn](http://yarn.fyi/react-scroll-trigger)

```sh
yarn add react-scroll-trigger
```

## How to use

```js
import ScrollTrigger from 'react-scroll-trigger';

...

  onEnterViewport() {
    this.setState({
      visible: true,
    });
  }

  onExitViewport() {
    this.setState({
      visible: false,
    });
  }

  render() {
    const {
      visible,
    } = this.state;

    return (
      <ScrollTrigger onEnter={this.onEnterViewport} onExit={this.onExitViewport}>
        <div className={`container ${visible ? 'container-animate' : ''}`}
      </ScrollTrigger>
    );
  }
```

The `ScrollTrigger` is intended to be used as a composable element, allowing you
to either use it standalone within a page (ie. no children).

```js
  <ScrollTrigger onEnter={this.onEnterViewport} onExit={this.onExitViewport} />
```

Or, pass in children to receive events and `progress` based on the dimensions of
those elements within the DOM.

```js
  <ScrollTrigger onEnter={this.onEnterViewport} onExit={this.onExitViewport}>
    <List>
      [...list items...]
    </List>
  </ScrollTrigger>
```

The beauty of this component is its flexibility. I’ve used it to trigger
AJAX requests based on either the `onEnter` or `progress` of the component within
the viewport. Or, as a way to control animations or other transitions that you
would like to either trigger when visible in the viewport or based on the exact
`progress` of that element as it transitions through the viewport.

### Properties

Below are the properties that can be defined on a `<ScrollTrigger />` instance.
In addition to these properties, all other standard React properites like `className`,
`key`, etc. can be passed in as well and will be applied to the `<div>` that will
be rendered by the `ScrollTrigger`.

* `component` - Node (Default: `div`)
* `throttleResize` - Number (Default: `100`)
* `throttleScroll` - Number (Default: `100`)
* `triggerOnLoad` - Boolean (Default: `true`)
* `onEnter` - Callback `({progress, velocity}, ref) => {}`
* `onExit` - Callback `({progress, velocity}, ref) => {}`
* `onProgress` - Callback `({progress, velocity}, ref) => {}`
* `onEnterTop` - Callback `({progress, velocity}, ref) => {}`
* `onEnterBottom` - Callback `({progress, velocity}, ref) => {}`

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
