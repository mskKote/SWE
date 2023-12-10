import React, { useState, KeyboardEvent } from 'react'
import { ModalHookResult } from '../../../utils/hooks/useModal';
import Modal from '../modal/Modal';
import styles from "./EntityModal.module.scss"

type Props = {
  modalHook: ModalHookResult
}

const EntityModal = ({ modalHook }: Props) => {
  const { closeBtn, options } = modalHook
  const [step, setStep] = useState(1)
  const [values, setValues] = useState<any>({})

  function nextStep() {
    setStep(x => x + 1)
  }
  function enter(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter') nextStep()
  }
  function onChange(name: string, value: string) {
    setValues((x: any) => ({ ...x, [name]: value }))
  }


  const header = (title: string) =>
    <div className={styles.stepHeaderWrapper}>
      <h1 className={styles.stepHeader}>{title}</h1>
      <button className={styles.cancel} {...closeBtn}>❌</button>
    </div>

  return (<Modal
    modalHook={modalHook}
    children={(modalProps) =>
      <div {...modalProps} className={styles.entityContainer}>
        {step === 1 && <div className={styles.step}>
          {header("Entity name")}
          <input
            className={styles.input}
            name="entityName"
            placeholder='Type...'
            required
            autoFocus
            onKeyDown={enter}
            onChange={e => onChange("entityName", e.target.value)}
          />
          <button
            className={`${styles.inputBtn} ${styles.nextStep}`}
            onClick={nextStep}>
            Next step
          </button>
        </div>}

        {step === 2 && <div className={styles.step}>
          {header("Primary key")}
          <input
            className={`${styles.input} ${styles.PK}`}
            name="pkName"
            placeholder='Type...'
            required
            autoFocus
            onKeyDown={enter}
            onChange={e => onChange("pkName", e.target.value)}
          />
          <label className={styles.smallPK}>PK = </label>
          <button
            className={`${styles.inputBtn} ${styles.confirm}`}
            onClick={() => options.createEntity(values)}>
            Confirm
          </button>
        </div>}
      </div >
    } />)
}

export default EntityModal