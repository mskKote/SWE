import React, { FormEvent, useState } from 'react'
import Select from 'react-select';
import { ModalHookResult } from '../../../utils/hooks/useModal';
import { methodOption, methodsArray } from '../../../utils/Requests/requestUtils';
import { EntityNodeData } from '../../architecture/ERDiagram/EntityNode/EntityNodeDataType';
import { mockEntityDataArray } from '../../architecture/ERDiagram/mock';
import { ERequestMethods } from '../../requests/Request/ERequestMethods';
import Modal from '../modal/Modal';
import styles from "./RequestModal.module.scss"

type Props = {
  modalHook: ModalHookResult
}

function entitiesArray(enitites: EntityNodeData[]): methodOption[] {
  return enitites.map(x => ({ value: x.entity, label: x.entity }))
}

function getBodyFromEntity(entity: EntityNodeData): string {
  const columns = entity.columns.map(x => ({ "name": x.name }))
  const result = { [entity.entity]: columns }
  return JSON.stringify(result, null, 4)
}
function getEntityFromString(enitites: EntityNodeData[], entity: string): EntityNodeData {
  return enitites.find(x => x.entity === entity)!
}

const RequestModal = ({ modalHook }: Props) => {
  const { closeBtn, options } = modalHook
  // console.group('RequestModal');
  // console.log(options); // request editRequest / createRequest 
  const [values, setValues] = useState<any>(() => {
    return options.request ?? { method: ERequestMethods.GET, entities: [] }
  })
  // console.log(values);
  // console.groupEnd();
  function onChange(name: string, value: any) {
    // console.log(value);
    setValues((x: any) => ({ ...x, [name]: value }))
  }

  //* CREATE | EDIT request
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // console.dir(e.currentTarget);
    const formValue = (name: string) => (e.currentTarget.elements.namedItem(name) as HTMLInputElement).value
    // console.log(
    //   formValue("name"),
    //   formValue("description"),
    //   formValue("URL"),
    //   formValue("body")
    // )
    // console.log(options.entities, values.entities);
    // console.log(values);
    const result = {
      ...values,
      entities: getEntityFromString(options.entities, values.entities),
      name: formValue("name"),
      description: formValue("description"),
      URL: formValue("URL"),
      body: formValue("body"),
    }

    if (!options.request)
      options.createRequest(result)
    else
      options.editRequest(result)
  }

  const header = (title: string) =>
    <div className={styles.headerWrapper}>
      <h1 className={styles.header}>{title}</h1>
      <button className={styles.cancel} {...closeBtn}>❌</button>
    </div>
  const selectMethods = (type: string) => {
    const methods = methodsArray()
    const current = methods.find(({ value }: any) => value === type) as methodOption
    return <Select
      defaultValue={current}
      options={methods}
      isSearchable={false}
      backspaceRemovesValue
      onChange={e => onChange("method", e!.value)}
      className={styles.input}
    />
  }
  const selectEntities = (entity: EntityNodeData) => {
    const entities = entitiesArray(options.entities)
    console.log(entity);
    const current = entities.find(x => x.value === entity?.entity)

    return <Select
      defaultValue={current}
      onChange={e => {
        if (!e?.value) return
        onChange("body", getBodyFromEntity(mockEntityDataArray.find(x => x.entity === e.value)!))
        onChange("entities", e.value)
      }}
      isClearable
      options={entities}
      isSearchable={false}
      backspaceRemovesValue
      className={styles.input}
    />
  }

  return (<Modal
    modalHook={modalHook}
    children={(modalProps) =>
      <div {...modalProps} className={styles.requestContainer}>
        {header("Request settings")}
        <form onSubmit={onSubmit}>
          <fieldset className={styles.meta}>
            <label className={styles.label}>Meta</label>
            <input defaultValue={values["name"]} name='name' className={styles.input} placeholder='Request name' required autoFocus />
            <textarea defaultValue={values["description"]} name='description' rows={1} className={styles.textarea} placeholder='Description' />
          </fieldset>
          <fieldset className={styles.main}>
            <label className={styles.label}>Main</label>
            <div>
              {selectMethods(values["method"])}
              <input defaultValue={values["url"]} name='URL' className={`${styles.input} ${styles.url}`} placeholder='URL' required autoFocus />
            </div>
          </fieldset>

          <fieldset className={styles.baseEntity}>
            <label className={styles.label}>Base entity</label>
            {selectEntities(values["entities"])}
          </fieldset>

          <fieldset className={styles.body}>
            <label className={styles.label}>Body</label>
            <textarea
              value={values['body']}
              onChange={({ target }) => onChange("body", target.value)}
              name='body'
              rows={2}
              className={styles.textarea}
              placeholder='Body'
            />
          </fieldset>

          <fieldset className={styles.confirmWrapper}>
            <button className={styles.confirm}>Confirm</button>
          </fieldset>
        </form>
      </div>
    } />)
}

export default RequestModal