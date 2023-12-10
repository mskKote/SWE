import React, { useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import Folder, { FolderFuncs } from './Folder/Folder'
import { IFolder } from './Folder/IFolder'
import { RequestFuncs } from './Request/Request'
import styles from "./Requests.module.scss"
import { v4 as uuidv4 } from 'uuid';
import { IRequest } from './Request/IRequest'

type Props = FolderFuncs & RequestFuncs & {
  folders: IFolder[]
}

const Requests = (props: Props) => {

  const [collectionName, setCollectionName] = useState("")


  function savePostmanCollection() {
    //TODO: props.folders → postman collection 
    console.group('savePostmanCollection');
    const folders = props.folders.map(formatFolder)

    const collection = {
      "info": {
        "_postman_id": uuidv4(),
        "name": collectionName,
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      "item": folders
    }
    function formatFolder(folder: IFolder) {
      return {
        "name": folder.name,
        "description": folder.description,
        "item": folder.requests.map(formatRequest)
      }
    }
    function formatRequest(request: IRequest) {
      console.log(request.name);

      const result: any = {
        "name": request.name,
        "protocolProfileBehavior": {
          "disableBodyPruning": true
        },
        "request": {
          "method": request.method,
          "header": [],
          "body": {
            "mode": "raw",
            "raw": request.body,
            "options": {
              "raw": {
                "language": "json"
              }
            }
          },
          "url": proccessURL(request.url),
          "description": request.description
        },
        "response": []
      }

      return result
    }
    function proccessURL(url: string) {
      const result: any = {
        "raw": url,//"https://effects.vercel.app/api/page",
        "protocol": url.split("://")[0],// "https",
        "host": url.split("://")[1].split('/')[0].split('.'),// ["effects", "vercel", "app"],
        "path": url.split("://")[1].split('/').filter((_, i) => i !== 0) //[ "api", "page" ]
      }

      return result
    }

    console.groupEnd();

    //* Экспорт файла
    const data = JSON.stringify(collection)
    let a = document.createElement("a");
    let file = new Blob([data], { type: 'application/json' });
    a.href = URL.createObjectURL(file);
    a.download = `${collectionName}.postman_collection.json`;
    a.click();
  }

  return <section className={styles.collectionContainer}>
    <header className={styles.collectionHeader}>
      <input
        value={collectionName}
        onChange={({ target }) => setCollectionName(target.value)}
        className={styles.collectionName}
        placeholder="Collection name..." />
      <button
        disabled={collectionName.length === 0}
        onClick={savePostmanCollection}
        className={styles.collectionExport}>
        💾
      </button>
    </header>

    <Droppable droppableId={`FOLDERS`}>
      {({ innerRef, droppableProps, placeholder }) =>
        <div {...droppableProps} ref={innerRef} className={styles.foldersContainer}>
          {props.folders.map((folder, key) =>
            <Folder key={key} folderId={key} {...folder} {...props} />)}

          {placeholder}
        </div>}
    </Droppable>
  </section>
}

export default Requests