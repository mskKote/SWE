import React, { MouseEventHandler, ReactElement } from 'react'
import { ModalHookResult } from "../../../utils/hooks/useModal"
import styles from "./Modal.module.scss"

export type ModalProps = {
  modalHook: ModalHookResult
  children(modalProps: { onClick: MouseEventHandler }): ReactElement<HTMLElement>;
}

const Modal: React.FC<ModalProps> = ({ modalHook, children }) => {
  if (!modalHook.isVisible) return null
  const onClick: MouseEventHandler = (e) => {
    e.stopPropagation()
  }

  return <section className={styles.modalWrapper}>
    {children({ onClick })}
  </section>
}

export default Modal