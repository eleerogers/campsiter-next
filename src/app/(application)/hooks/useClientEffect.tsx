import { useEffect, DependencyList, useRef } from 'react';

const useIsClient = () => {
  const isClient = useRef(false);
  useEffect(() => {
    isClient.current = true;
  }, []);
  return isClient.current;
};

const useClientEffect = (effect: () => void, dependencies: DependencyList) => {
  const isClient = useIsClient();
  const effectRef = useRef(effect);

  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    if (isClient) {
      const memoizedEffect = () => effectRef.current();
      return memoizedEffect();
    }
  }, [isClient, dependencies]);
};

export default useClientEffect;
