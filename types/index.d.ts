// TypeScript Version: 3.0

import { Component, ReactNode } from 'react';

export interface ScrollTriggerEventArgs {
  progress: number;
  velocity: number;
}

export interface ScrollTriggerProps {
  component?: ReactNode;
  containerRef?: HTMLElement | string;
  throttleResize?: number;
  throttleScroll?: number;
  triggerOnLoad?: boolean;
  onEnter?: (args?: ScrollTriggerEventArgs) => void;
  onExit?: (args?: ScrollTriggerEventArgs) => void;
  onProgress?: (args?: ScrollTriggerEventArgs) => void;
}

declare class ScrollTrigger extends Component<ScrollTriggerProps> {}

export default ScrollTrigger;
