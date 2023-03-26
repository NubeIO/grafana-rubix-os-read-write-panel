import React from 'react';
import { Modal } from '@grafana/ui';

function GenericDialog(props: any) {
  if (!props.dialogName) {
    return null;
  }

  const DialogBody = props.dialogBody;

  return (
    <Modal
      title={props.title}
      onDismiss={props.onClose}
      onClickBackdrop={props.onClose}
      isOpen={props.open}
      icon={props.icon}
    >
      {DialogBody && (
        <DialogBody
          dialogName={props.name}
          dialogTitle={props.title}
          id={`customized-dialog-${props.dialogId}`}
          closeGenericDialog={props.onClose}
          {...props}
        />
      )}
    </Modal>
  );
}

export default GenericDialog;

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}