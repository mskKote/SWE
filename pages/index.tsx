import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useNodesState, useEdgesState } from "react-flow-renderer";
import { EExpandDirection, useExpand } from "../utils/hooks/useExpand";
import { useModal } from "../utils/hooks/useModal";
import styles from "../styles/Home.module.scss";

import {
  EntityNodeData,
  EntityNodeDataColumn,
} from "../components/architecture/ERDiagram/EntityNode/EntityNodeDataType";
import Architecture from "../components/architecture/Architecture";
import Requests from "../components/requests/Requests";
import Codebar from "../components/codebar/Codebar";
import { EToolType } from "../components/tools/tool/ToolCard";
import Tools from "../components/tools/Tools";
import EntityModal from "../components/modals/entityModal/EntityModal";
import FolderModal from "../components/modals/folderModal/FolderModal";
import RequestModal from "../components/modals/requestModal/RequestModal";
import ConfirmModal from "../components/modals/confirmModal/ConfirmModal";
import { EPostgresTypes } from "../components/architecture/ERDiagram/EPostgresTypes";
import {
  createColumn,
  createEntity,
  createEntityData,
} from "../utils/ERDiagram/nodeUtils";
import { mockFolders } from "../components/requests/mock";
import { createFolder } from "../utils/Requests/folderUtils";
import { ERequestMethods } from "../components/requests/Request/ERequestMethods";
import { IRequest } from "../components/requests/Request/IRequest";

const Home: NextPage = () => {
  const verExpand = useExpand(EExpandDirection.VERTICAL);
  const horExpand = useExpand(EExpandDirection.HORIZONTAL);
  const entityModal = useModal();
  const folderModal = useModal();
  const requestModal = useModal();
  const confirmModal = useModal();
  //* ER
  const [nodes, setNodes, onNodesChange] = useNodesState<EntityNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  //* Folders[Requests]
  const [folders, setFolders] = useState(mockFolders);

  //*================================= Entities
  function _createEntityWithModal(values: any) {
    // console.log(values)
    // console.log(nodes);
    setNodes((nodes) => {
      let newId = `0`;
      const last = nodes[nodes.length - 1];
      if (last) newId = `${+last.id + 1}`;
      return [
        ...nodes,
        createEntity(
          newId,
          createEntityData(values["entityName"], [
            createColumn(
              true,
              false,
              values["pkName"],
              EPostgresTypes.bigserial
            ),
          ]),
          nodeFuncsData
        ),
      ];
    });
    entityModal.close();
  }
  function addNodeColumn(id: string) {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id !== id
          ? node
          : {
              ...node,
              data: {
                ...node.data,
                columns: [
                  ...node.data.columns,
                  {
                    type: EPostgresTypes.serial,
                    tableKey: { isPK: false, isFK: false },
                    name: "",
                  },
                ],
              },
            }
      )
    );
  }
  function changeNodeName(id: string, value: string) {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? node
          : {
              ...node,
              data: {
                ...node.data,
                entity: value,
              },
            }
      )
    );
  }
  function changeNodeColumn(
    id: string,
    colName: string,
    isOption: boolean,
    property: string,
    value: string | any
  ) {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id !== id) return node;
        // console.group('changeNodeColumn', property, value);
        // console.log(node.data.columns.map(x => x.name).join(", "));
        const newColumns = node.data.columns.map((column) => {
          if (column.name !== colName) return column;
          // console.log(column.name);
          if (isOption)
            return {
              ...column,
              options: { ...column.options, [property]: value },
            };
          else return { ...column, [property]: value };
        });
        // console.groupEnd();

        return { ...node, data: { ...node.data, columns: newColumns } };
      })
    );
  }
  function deleteNodeColumn(id: string, name: string, position: number) {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id !== id
          ? node
          : {
              ...node,
              data: {
                ...node.data,
                columns: node.data.columns.filter(
                  (column) => column.name !== name
                ),
              },
            }
      )
    );
    setEdges((edges) =>
      edges.filter(({ source, target, sourceHandle, targetHandle }) => {
        // console.log(source, sourceHandle, target, targetHandle);
        // edge not connected with node
        // if (source !== id && target !== id) return true
        if (source === id && sourceHandle === `source-${position}`)
          return false;
        if (target === id && targetHandle === `target-${position}`)
          return false;
        return true;
      })
    );
  }
  function deleteNode(id: string) {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== id && edge.target !== id)
    );
  }
  const nodeFuncsData = useMemo(
    () =>
      ({
        addNodeColumn,
        changeNodeColumn,
        changeNodeName,
        deleteNodeColumn,
        deleteNode,
        confirmModal,
      } as EntityNodeData["funcs"]),
    []
  );
  //?================================= Requests
  function _createFolder(values: any) {
    // console.log(values)
    // console.log(folders)
    setFolders((x) => [
      ...x,
      createFolder(values["name"], values["description"]),
    ]);
    folderModal.close();
  }
  function _createRequest(folderId: number, values: any) {
    console.log(folderId, values);
    const result = [...folders];
    result[+folderId].requests.push({
      name: values.name,
      description: values.description,
      url: values.URL,
      method: values.method,
      params: [], //TODO: разбить, хотя зачем
      body: values.body,
      entities: values.baseEntity,
    });
    setFolders(result);
    requestModal.close();
  }
  function _editFolder(
    folderId: number,
    name: "name" | "description",
    value: any
  ) {
    // console.log("_editFolder", folderId, name, value);
    setFolders((folders) =>
      folders.map((folder, i) => {
        if (i === folderId) folder[name] = value;
        return folder;
      })
    );
  }
  function _deleteFolder(folderId: number) {
    // console.log("_deleteFolder", folderId);
    setFolders((folders) => folders.filter((_, i) => i !== folderId));
  }
  function _editRequest(
    folderId: number,
    requestId: number,
    name: "name" | "method" | "url",
    value: string | ERequestMethods
  ) {
    setFolders((folders) =>
      folders.map((folder, i) => {
        if (i !== folderId) return folder;
        // Edit folder
        folder.requests = folder.requests.map((request, i) => {
          if (i !== requestId) return request;
          // Set request values
          if (name === "method") request[name] = value as ERequestMethods;
          else request[name] = value as string;
          return request;
        });
        // console.log(folder.requests.map(x => x.method))
        return folder;
      })
    );
  }
  function _editRequestDetails(
    folderId: number,
    requestId: number,
    request: IRequest
  ) {
    const editRequest = (values: any) => {
      // console.log(folderId, requestId, values.entities);
      const result = [...folders];
      result[folderId].requests[requestId] = {
        name: values.name,
        description: values.description,
        url: values.URL,
        method: values.method,
        params: [], //TODO: разбить, хотя зачем
        body: values.body,
        entities: values.entities,
      };
      setFolders(result);
      requestModal.close();
    };

    requestModal.show({
      request,
      editRequest,
      entities: nodes.map((x) => x.data),
    });
    // console.log("editRequestDetails", folderId, requestId, request);
  }
  function _deleteRequest(folderId: number, requestId: number) {
    // console.log("deleteRequest", folderId, requestId);

    setFolders((folders) =>
      folders.map((folder, i) => {
        if (i !== folderId) return folder;
        const requests = folder.requests.filter((_, i) => i !== requestId);
        return { ...folder, requests };
      })
    );
  }

  //*================================= Drag and Drop
  function handleOnDragEnd(dropResult: DropResult) {
    if (!dropResult.destination) return;
    const { destination, draggableId } = dropResult;
    const { droppableId } = destination;
    // console.log("handleOnDragEnd", droppableId, draggableId)

    if (droppableId === "ARCHITECTURE" && draggableId === EToolType.ENTITY)
      return entityModal.show({ createEntity: _createEntityWithModal });

    if (droppableId === "FOLDERS" && draggableId === EToolType.FOLDER) {
      return folderModal.show({ createFolder: _createFolder });
    }

    if (
      droppableId.startsWith("FOLDER-") &&
      draggableId === EToolType.REQUEST
    ) {
      const folderId = +droppableId.slice(7);
      return requestModal.show({
        request: null,
        createRequest: (values: any) => _createRequest(folderId, values),
        entities: nodes.map((x) => x.data),
      });
    }
  }
  //* fix Dnd
  const [winReady, setwinReady] = useState(false);
  useEffect(() => setwinReady(true), []);
  if (!winReady)
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  //*=================================

  return (
    <div className={styles.layout} {...horExpand.wrapper}>
      <Head>
        <title>SWE LCNC SQL</title>
        <link rel="icon" href="/icon.svg" />
        {/* Common */}
        <meta charSet="UTF-8" />
        <meta name="description" content="Low code database" />
        <meta
          name="keywords"
          content="Low code, LowCode, low-code, draw db, database constructor, ERD, ER, Postman"
        />
        <meta name="viewport" content="width=device-width" />
        <meta name="Author" content="Popov Vitaly" />
      </Head>

      {/* SQL */}
      <Codebar
        expand={horExpand}
        entities={nodes.map((node) => node.data)}
        relations={edges}
      />

      {/* Modals */}
      {entityModal.isVisible && <EntityModal modalHook={entityModal} />}
      {folderModal.isVisible && <FolderModal modalHook={folderModal} />}
      {requestModal.isVisible && <RequestModal modalHook={requestModal} />}
      {confirmModal.isVisible && <ConfirmModal modalHook={confirmModal} />}

      {/* Zone to expand codebar panel */}
      <div {...horExpand.container1} className={styles.mainWrapper}>
        {/* Zone to expand requests panel */}
        <main className={styles.expandableWrapper} {...verExpand.wrapper}>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <div
              {...verExpand.container2}
              className={styles.expandableContainer2}
            >
              <Architecture
                nodeFuncsData={nodeFuncsData}
                nodes={nodes}
                edges={edges}
                setNodes={setNodes}
                setEdges={setEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
              />
            </div>

            {/* Expandable panel */}
            <div
              {...verExpand.container1}
              className={styles.expandableContainer1}
            >
              <button
                {...verExpand.trigger}
                className={styles.expandableTrigger}
              >
                ♦
              </button>
              <Requests
                folders={folders}
                editFolder={_editFolder}
                deleteFolder={_deleteFolder}
                deleteRequest={_deleteRequest}
                editRequest={_editRequest}
                editRequestDetails={_editRequestDetails}
              />
            </div>

            {/* Panel with Entity|API|Folder cards, which are Draggable */}
            <Tools />
          </DragDropContext>
        </main>
      </div>
    </div>
  );
};

export default Home;
