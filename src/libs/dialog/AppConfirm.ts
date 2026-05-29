type ConfirmOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

type AppConfirmFunction = (options: ConfirmOptions) => Promise<boolean>;

let AppConfirmHandler: AppConfirmFunction | null = null;

export const setAppConfirmHandler = (handler: AppConfirmFunction) => {
  AppConfirmHandler = handler;
};

export const AppConfirm = async (options: ConfirmOptions): Promise<boolean> => {
  if (!AppConfirmHandler) {
    throw new Error("appConfirm is not initialized");
  }

  return AppConfirmHandler(options);
};
