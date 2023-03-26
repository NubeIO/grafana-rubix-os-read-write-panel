import React, { useState, useEffect } from 'react';
import GenericDialog from './genericDialog';

function withGenericDialog(ComposedComponent: any) {
  return function (props: any) {
    const [dialogId, updateDialogId] = useState('');
    const [dialogProps, updateDialogProps] = useState({});
    const [open, setOpen] = useState(false);
    useEffect(() => {
      if (!!dialogId) {
        setOpen(true);
      }
    }, [dialogId]);

    const closeDialog = () => {
      updateDialogId('');
      updateDialogProps({});
      setOpen(false);
    };

    const openDialogByName = (id: string, dialogProps: any = {}) => {
      updateDialogId(id);
      updateDialogProps(dialogProps);
      setOpen(true);
    };

    return (
      <>
        <ComposedComponent {...props} openGenericDialog={openDialogByName} closeGenericDialog={closeDialog} />
        <GenericDialog dialogName={dialogId} onClose={closeDialog} open={open} {...props} {...dialogProps} />
      </>
    );
  };
}

export default withGenericDialog;
