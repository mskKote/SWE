import { ModalHookResult } from './../../../../utils/hooks/useModal';
import { EPostgresTypes } from "../EPostgresTypes"

export type EntityNodeDataColumn = {
  tableKey: { isPK: boolean, isFK: boolean },
  name: string,
  type: EPostgresTypes,
  options?: any
}

export type EntityNodeData = {
  entity: string,
  columns: EntityNodeDataColumn[]
  funcs: {
    addNodeColumn: (id: string) => void,
    changeNodeName: (id: string, value: string) => void,
    changeNodeColumn: (id: string, colName: string, isOption: boolean, property: string, value: string | any) => void,
    deleteNodeColumn: (id: string, name: string, position: number) => void,
    deleteNode: (id: string) => void,
    confirmModal?: ModalHookResult,
  }
}