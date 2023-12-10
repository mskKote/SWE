import React, { useState } from 'react'
import { ModalHookResult } from '../../../utils/hooks/useModal';
import Modal from '../modal/Modal';
import styles from "./FolderModal.module.scss"

type Props = {
  modalHook: ModalHookResult
}

const FolderModal = ({ modalHook }: Props) => {
  const { closeBtn, options } = modalHook

  const [values, setValues] = useState<any>({})
  function onChange(name: string, value: string) {
    setValues((x: any) => ({ ...x, [name]: value }))
  }

  const header = (title: string) =>
    <div className={styles.headerWrapper}>
      <h1 className={styles.header}>{title}</h1>
      <button className={styles.cancel} {...closeBtn}>❌</button>
    </div>

  return (<Modal
    modalHook={modalHook}
    children={(modalProps) =>
      <div {...modalProps} className={styles.folderContainer}>
        {header("Folder settings")}
        <input
          className={styles.input}
          placeholder='Folder name'
          required
          autoFocus
          onChange={e => onChange("name", e.target.value)}
        />
        <textarea
          className={styles.textarea}
          placeholder='Description'
          rows={3}
          onChange={e => onChange("description", e.target.value)}
        />
        <button
          className={styles.createFolder}
          onClick={() => options.createFolder(values)}>
          Create folder
        </button>
      </div>
    } />)
}

export default FolderModal