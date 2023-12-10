import React from 'react'
import { ModalHookResult } from '../../../utils/hooks/useModal';
import Modal from '../modal/Modal';
import styles from "./ConfirmModal.module.scss"

type Props = {
  modalHook: ModalHookResult
}

const ConfirmModal = ({ modalHook }: Props) => {
  const { closeBtn, close, options } = modalHook
  // console.log(options);

  return (<Modal
    modalHook={modalHook}
    children={(modalProps) =>
      <div {...modalProps} className={styles.confirmContainer}>
        <h1 className={styles.header}>Are you sure?</h1>
        <div className={styles.options}>
          <button onClick={options.no} className={`${styles.btn} ${styles.no}`}>No</button>
          <button onClick={options.yes} className={`${styles.btn} ${styles.yes}`}>Yes</button>
        </div>
      </div>
    } />)
}

export default ConfirmModal