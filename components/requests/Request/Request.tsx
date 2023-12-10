import React from 'react'
import Select from 'react-select'
import { getERequestMethod, methodOption, methodsArray } from '../../../utils/Requests/requestUtils'
import { ERequestMethods } from './ERequestMethods'
import { IRequest } from './IRequest'
import styles from "./Request.module.scss"

export type RequestFuncs = {
  editRequest: (folderId: number, requestId: number, name: "name" | "method" | "url", value: string | ERequestMethods) => void,
  editRequestDetails: (folderId: number, requestId: number, request: IRequest) => void,
  deleteRequest: (folderId: number, requestId: number) => void,
}

type Props = RequestFuncs & {
  request: IRequest,
  folderId: number,
  requestId: number,
}

const Request = ({ request, folderId, requestId, editRequest, editRequestDetails, deleteRequest }: Props) => {
  const selectMethods = (type: string) => {
    const methods = methodsArray()
    let current = methods.find(({ value }) => value === type) as methodOption
    return <Select
      value={current}
      options={methods}
      isSearchable={false}
      backspaceRemovesValue
      className={styles.selectType}
      onChange={e => editRequest(folderId, requestId, "method", getERequestMethod(e?.value as string) ?? ERequestMethods.GET)}
    />
  }

  return <div className={styles.requestCard} key={requestId}>
    <div className={styles.requestCardHeader}>
      {selectMethods(request.method)}
      <input
        className={styles.url}
        onChange={({ target }) => editRequest(folderId, requestId, "url", target.value)}
        value={request.url} />
      <button
        className={styles.edit}
        onClick={() => editRequestDetails(folderId, requestId, request)}>🖋️</button>
      <button
        className={styles.delete}
        onClick={() => deleteRequest(folderId, requestId)}>❌</button>
    </div>
  </div>
}

export default Request