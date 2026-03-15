import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

interface LogoAnimationContextType {
  triggerAnimation: () => void;
  isAnimating: boolean;
}

const LogoAnimationContext = createContext<
  LogoAnimationContextType | undefined
>(undefined);

export function LogoAnimationProvider({ children }: { children: ReactNode }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  }, []);

  return (
    <LogoAnimationContext.Provider value={{ triggerAnimation, isAnimating }}>
      {children}
    </LogoAnimationContext.Provider>
  );
}

export function useLogoAnimation() {
  const context = useContext(LogoAnimationContext);
  if (!context) {
    throw new Error(
      "useLogoAnimation must be used within LogoAnimationProvider",
    );
  }
  return context;
}
