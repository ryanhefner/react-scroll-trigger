// TypeScript Version: 3.0

import { Component, ReactNode } from 'react';

export interface ScrollTrigger extends Component {
  component?: ReactNode;
  containerRef?: HTMLElement | string;
  throttleResize?: number;
  throttleScroll?: number;
  triggerOnLoad?: boolean;
  onEnter?: () => {};
  onExit?: () => {};
  onProgress?: () => {};
}
