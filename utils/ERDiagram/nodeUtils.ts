import { EntityNodeData, EntityNodeDataColumn } from "../../components/architecture/ERDiagram/EntityNode/EntityNodeDataType"
import { EPostgresTypes } from "../../components/architecture/ERDiagram/EPostgresTypes"
import { Node } from 'react-flow-renderer';
import styles from "../../components/architecture/ERDiagram/EntityNode/EntityNode.module.scss"

const defaultEntityFuncs: EntityNodeData["funcs"] = {
  addNodeColumn: () => { },
  deleteNodeColumn: () => { },
  changeNodeName: () => { },
  changeNodeColumn: () => { },
  deleteNode: () => { }
}

//* Demo position system
//* It should be from nodes
export function getPosition(id: string): { x: number, y: number } {
  const positions = [
    { x: 300 * 1.25, y: 300 },
    { x: 600 * 1.25, y: 150 },
    { x: 600 * 1.25, y: 450 },
    { x: 0, y: 300 },
    { x: 0, y: 0, },
  ]

  return positions[+id % positions.length]
}

export function createEntity(newId: string, entityNodeData: EntityNodeData, funcs: EntityNodeData["funcs"]): Node<EntityNodeData> {
  return {
    id: newId,
    type: 'entityNode',
    data: { ...entityNodeData, funcs },
    className: styles.entityNode,
    position: getPosition(newId)
  }
}

export function createEntityData(
  entity: string,
  columns: EntityNodeDataColumn[]): EntityNodeData {
  return { entity, funcs: defaultEntityFuncs, columns }
}

export function createColumn(
  isPK: boolean,
  isFK: boolean,
  name: string,
  type: EPostgresTypes,
  options?: any): EntityNodeDataColumn {
  return { tableKey: { isPK, isFK }, name, type, options }
}