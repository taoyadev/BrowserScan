'use client';

import { useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: TurnstileOptions
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  tabindex?: number;
}

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  className?: string;
}

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

export function Turnstile({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = 'dark',
  size = 'normal',
  className = ''
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const scriptLoadedRef = useRef(false);

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile) return;

    // Remove existing widget
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        // Ignore errors
      }
    }

    // Render new widget
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: onVerify,
      'error-callback': onError,
      'expired-callback': onExpire,
      theme,
      size
    });
  }, [siteKey, onVerify, onError, onExpire, theme, size]);

  useEffect(() => {
    // Load Turnstile script if not already loaded
    if (!scriptLoadedRef.current) {
      const existingScript = document.querySelector(
        `script[src="${TURNSTILE_SCRIPT_URL}"]`
      );

      if (!existingScript) {
        const script = document.createElement('script');
        script.src = TURNSTILE_SCRIPT_URL;
        script.async = true;
        script.defer = true;

        window.onTurnstileLoad = () => {
          scriptLoadedRef.current = true;
          renderWidget();
        };

        script.onload = () => {
          // Wait for turnstile to be ready
          if (window.turnstile) {
            scriptLoadedRef.current = true;
            renderWidget();
          }
        };

        document.head.appendChild(script);
      } else if (window.turnstile) {
        scriptLoadedRef.current = true;
        renderWidget();
      }
    } else if (window.turnstile) {
      renderWidget();
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Ignore errors on cleanup
        }
      }
    };
  }, [renderWidget]);

  return (
    <div
      ref={containerRef}
      className={`turnstile-container ${className}`}
      data-theme={theme}
      data-size={size}
    />
  );
}

/**
 * Hook for Turnstile verification
 */
export function useTurnstile(siteKey: string) {
  const tokenRef = useRef<string | null>(null);

  const handleVerify = useCallback((token: string) => {
    tokenRef.current = token;
  }, []);

  const handleExpire = useCallback(() => {
    tokenRef.current = null;
  }, []);

  const getToken = useCallback(() => tokenRef.current, []);

  return {
    handleVerify,
    handleExpire,
    getToken,
    siteKey
  };
}
