import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { IFolder } from './IFolder'
import { IRequest } from '../Request/IRequest'
import Request, { RequestFuncs } from '../Request/Request'
import styles from "./Folder.module.scss"

export type FolderFuncs = {
  deleteFolder: (folderId: number) => void,
  editFolder: (folderId: number, name: 'name' | 'description', value: any) => void,
}


type Props = IFolder & FolderFuncs & RequestFuncs & {
  folderId: number,
}

const Folder = ({ folderId, name, description, requests, editFolder, deleteFolder, editRequest, editRequestDetails, deleteRequest }: Props) => {

  return <div className={styles.folder} key={folderId}>
    {/* Folder info */}
    <div className={styles.folderInfo}>
      <input
        className={styles.folderName}
        defaultValue={name}
        placeholder={"Folder..."}
        onBlur={({ target }) => editFolder(folderId, "name", target.value)} />
      <input
        className={styles.folderDesc}
        defaultValue={description}
        placeholder={"Description..."}
        onBlur={({ target }) => editFolder(folderId, "description", target.value)} />
      <button
        className={styles.deleteFolder}
        onClick={() => deleteFolder(folderId)}>
        🚮
      </button>
    </div>

    {/* Requests */}
    <div className={styles.requestsContainer}>
      {requests.length === 0
        ? <p className={styles.noRequests}>❗ No requests ❗</p>
        : requests.map((request, key) =>
          <Request
            key={key}
            folderId={folderId}
            requestId={key}
            request={request}
            deleteRequest={deleteRequest}
            editRequestDetails={editRequestDetails}
            editRequest={editRequest}
          />)}
    </div>

    {/* DnD request to folder */}
    <Droppable droppableId={`FOLDER-${folderId}`}>
      {({ innerRef, droppableProps, placeholder }, snapshot) =>
        <div
          {...droppableProps}
          ref={innerRef}
          className={styles.newFolder}
          style={snapshot.isDraggingOver ? { background: "gray" } : undefined}
        >
          <div className={styles.innerNewFolder}>
            +
            {placeholder}
          </div>
        </div>}
    </Droppable>
  </div>
}

export default Folder