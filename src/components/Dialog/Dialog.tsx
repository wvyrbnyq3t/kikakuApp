// hooks
import { createContext, useContext, useEffect, useRef } from "react";

// styles
import "../../css/Dialog.css";

// types
import type { ComponentPropsWithoutRef, ReactNode, RefObject } from "react";
import Slot from "../Slot";

type DialogContextType = {
  dialogRef: RefObject<HTMLDialogElement | null>;
  closeDialog: () => void;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
};

const DialogContext = createContext<DialogContextType | null>(null);

const useDialogContext = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useDialogContext must be used within a DialogProvider");
  }

  return context;
};

type DialogProps = {
  children: ReactNode;
  open?: boolean;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const Dialog = ({
  children,
  open,
  closeOnBackdrop,
  closeOnEsc,
  onOpenChange,
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeDialog = () => {
    const dialog = dialogRef.current;

    if (!dialog) return;
    if (!dialog.open) return;
    if (!closeOnBackdrop && dialogRef.current?.open) return;
    if (!closeOnEsc && dialogRef.current?.open) return;

    dialog.close();
    onOpenChange?.(false);
  };

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;
    if (open === undefined) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <DialogContext.Provider
      value={{
        dialogRef,
        closeDialog,
        closeOnBackdrop,
        closeOnEsc,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

type DialogContentProps = {
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
} & ComponentPropsWithoutRef<"dialog">;

const DialogContent = ({
  children,
  className,
  onCancel,
  onClick,
  onClose,
  ...props
}: DialogContentProps) => {
  const { dialogRef, closeOnBackdrop, closeOnEsc, closeDialog } =
    useDialogContext();

  const classNames = ["c-dialog", className].filter(Boolean).join(" ");

  return (
    <dialog
      ref={dialogRef}
      className={classNames}
      onCancel={(event) => {
        onCancel?.(event);

        if (event.defaultPrevented) return;

        if (!closeOnEsc) {
          event.preventDefault();
        }
      }}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented) return;
        if (!closeOnBackdrop) return;

        if (event.target === event.currentTarget) {
          closeDialog();
        }
      }}
      onClose={(event) => {
        onClose?.(event);
      }}
      {...props}
    >
      <div className="c-dialog__inner">{children}</div>
    </dialog>
  );
};

const DialogTrigger = ({
  className,
  onClick,
  ...props
}: ComponentPropsWithoutRef<"button">) => {
  const { dialogRef } = useDialogContext();

  const classNames = ["c-dialog__trigger", className].filter(Boolean).join(" ");

  return (
    <Slot
      className={classNames}
      onClick={() => {
        dialogRef.current?.showModal();
      }}
      {...props}
    />
  );
};

const DialogClose = ({
  className,
  onClick,
  ...props
}: ComponentPropsWithoutRef<"button">) => {
  const { closeDialog } = useDialogContext();

  const classNames = ["c-dialog__close", className].filter(Boolean).join(" ");

  return (
    <Slot
      className={classNames}
      onClick={() => {
        closeDialog();
      }}
      {...props}
    />
  );
};

export { Dialog, DialogContent, DialogTrigger, DialogClose };
