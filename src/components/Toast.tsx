import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { CSSProperties, HTMLAttributes } from "react";

import "../css/Toast.css";
import { Icon } from "./Icon";
import { IconButton } from "./Button";

type ToastData = {
  duration: number; // ms
  icon?: string;
  id: string;
  message?: string;
  title: string;
};

type ShowToastOptions = {
  duration?: number;
  icon?: string;
  message?: string;
  title: string;
};

type ToastContextType = {
  showToast: (options: ShowToastOptions) => void;
  closeToast: (id: string) => void;
  clearToasts: () => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

const useToastContext = () => {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return ctx;
};

const Toast = ({ ...props }: HTMLAttributes<HTMLDivElement>) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);
  const showToast = useCallback((options: ShowToastOptions) => {
    const id = crypto.randomUUID();

    setToasts((prev) => [
      ...prev,
      {
        id,
        title: options.title,
        duration: options.duration ?? 2000,
        icon: options.icon,
        message: options.message,
      },
    ]);
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      closeToast,
      clearToasts,
    }),
    [showToast, closeToast, clearToasts],
  );

  return (
    <ToastContext.Provider value={value}>
      <div {...props} />

      <ToastViewport>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} onClose={closeToast} />
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  );
};

const ToastViewport = ({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) => {
  const classNames = ["l-toast-viewport", className].filter(Boolean).join(" ");
  return (
    <div
      className={classNames}
      aria-live="polite"
      aria-atomic={false}
      {...props}
    />
  );
};

type ToastItemProps = {
  onClose: (id: string) => void;
} & ToastData;

const ToastItem = ({
  duration,
  id,
  message,
  icon,
  title,
  onClose,
}: ToastItemProps) => {
  useEffect(() => {
    const timeotId = window.setTimeout(() => {
      onClose(id);
    }, duration);

    return () => {
      window.clearTimeout(timeotId);
    };
  }, [duration, id, onClose]);

  return (
    <div
      className="c-toast"
      style={
        {
          "--duration": `${duration}ms`,
        } as CSSProperties
      }
    >
      <div
        style={{
          display: "flex",
          gap: "var(--space-sm)",
          alignContent: "center",
          width: "100%",
        }}
      >
        {icon && (
          <Icon variant="ghost" className="c-toast__icon">
            {icon}
          </Icon>
        )}
        <div className="c-toast__content">
          <p className="c-toast__title">{title}</p>
          {message && <p>{message}</p>}
        </div>
      </div>
      <IconButton
        variant="ghost"
        className="u-mrgn--left-auto"
        style={{
          pointerEvents: "all",
        }}
        onClick={() => onClose(id)}
      >
        close
      </IconButton>
    </div>
  );
};

const useToast = () => {
  const { showToast, closeToast, clearToasts } = useToastContext();

  return {
    showToast,
    closeToast,
    clearToasts,
  };
};

export { Toast, ToastViewport, ToastItem, useToast };
export type { ToastData, ShowToastOptions };
