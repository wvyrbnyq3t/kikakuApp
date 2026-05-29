import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { setAppConfirmHandler } from "../../libs/dialog/AppConfirm";

// components
import { Dialog, DialogContent } from "./Dialog";
import { Button } from "../Button";
import { GridContaienr } from "../GridContainer";
import { Section, SectionTitle } from "../Section";

// types
import type { HTMLAttributes } from "react";

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

type DialogState = {
  options: ConfirmOptions;
};

const DialogProvider = ({ children }: HTMLAttributes<HTMLDialogElement>) => {
  const [dialogState, setDialogState] = useState<DialogState | null>(null);

  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const closeDialog = useCallback((result: boolean) => {
    resolveRef.current?.(result);
    resolveRef.current = null;
    setDialogState(null);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    setDialogState({ options });

    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  useEffect(() => {
    setAppConfirmHandler(confirm);
  }, [confirm]);

  return (
    <>
      {children}
      {dialogState &&
        createPortal(
          <Dialog open closeOnEsc={false} closeOnBackdrop={false}>
            <DialogContent>
              <Section style={{ textAlign: "center" }}>
                <div>
                  <SectionTitle level={2}>
                    {dialogState.options.title}
                  </SectionTitle>
                  {dialogState.options.description && (
                    <p>{dialogState.options.description}</p>
                  )}
                </div>
                <GridContaienr columns={2} gap={"var(--space-sm)"}>
                  <Button
                    variant="secondary"
                    className="u-width--full"
                    onClick={() => closeDialog(false)}
                  >
                    {dialogState.options.cancelText || "キャンセル"}
                  </Button>
                  <Button
                    variant="danger"
                    className="u-width--full"
                    onClick={() => closeDialog(true)}
                  >
                    {dialogState.options.confirmText || "確認した"}
                  </Button>
                </GridContaienr>
              </Section>
            </DialogContent>
          </Dialog>,
          document.body,
        )}
    </>
  );
};

export { DialogProvider };
