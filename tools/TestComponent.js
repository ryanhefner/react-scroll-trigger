import React, { Component } from 'React';
import cleanProps from 'clean-react-props';

class TestComponent extends Component {
  render() {
    const {
      children,
    } = this.props;

    return (
      <section {...cleanProps(this.props)}>{children}</section>
    );
  }
};

export default TestComponent;
