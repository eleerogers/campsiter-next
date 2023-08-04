import React from 'react';
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
  const [showLoader, setShowLoader] = React.useState(false);
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const ref = React.useRef<HTMLButtonElement>(null);
  const [fadeOutProps, setFadeOutProps] = useSpring(() => ({ opacity: 0 }));
  const [fadeInProps, setFadeInProps] = useSpring(() => ({ opacity: 0 }));

  React.useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      setFadeOutProps({ opacity: 1 });
      setFadeInProps({ opacity: 0 });
    } else {
      setShowLoader(false);
      setFadeOutProps({ opacity: 0 });
      setFadeInProps({ opacity: 1 });

      if (showLoader) {
        const timeout = setTimeout(() => {
          setShowLoader(false);
        }, 400);

        return () => {
          clearTimeout(timeout);
        };
      }
    }
  }, [isLoading, showLoader, setFadeOutProps, setFadeInProps]);

  React.useEffect(() => {
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
        showLoader
          ? {
              width: `${width}px`,
              height: `${height}px`,
            }
          : {}
      }
    >
      {showLoader ? (
        <animated.div style={fadeOutProps}>
          <div className="loader" />
        </animated.div>
      ) : (
        <animated.div style={fadeInProps}>{children}</animated.div>
      )}
    </Button>
  );
}

