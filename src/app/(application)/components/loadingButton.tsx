import React, { useRef, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import Button from 'react-bootstrap/Button';

interface Props {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: string;
  type?: string;
}

export default function LoadingButton({ isLoading, children, ...props }: Props) {
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const ref = useRef<HTMLButtonElement>(null);
  
  // Define one spring animation for both fade-in and fade-out
  const fadeProps = useSpring({ opacity: isLoading ? 1 : 0 });

  useEffect(() => {
    if (ref.current && ref.current.getBoundingClientRect().width) {
      setWidth(ref.current.getBoundingClientRect().width);
    }
    if (ref.current && ref.current.getBoundingClientRect().height) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, [children, isLoading]);

  return (
    <Button
      {...props}
      ref={ref}
      size="lg"
      style={
        isLoading
          ? {
              width: `${width}px`,
              height: `${height}px`,
            }
          : {}
      }
    >
      {isLoading ? (
        <animated.div style={fadeProps}>
          <div className="loader" />
        </animated.div>
      ) : (
        <animated.div style={fadeProps}>{children}</animated.div>
      )}
    </Button>
  );
}

