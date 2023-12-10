import React from 'react'
import styles from "./Codebar.module.scss"
import dynamic from 'next/dynamic'
import { useExpandResult } from '../../utils/hooks/useExpand'
import { EntityNodeData, EntityNodeDataColumn } from '../architecture/ERDiagram/EntityNode/EntityNodeDataType'
import { Edge } from 'react-flow-renderer'
const CodeEditor = dynamic(import('./editor/CodeEditor'), { ssr: false })


// const defaultValue = `
// CREATE TABLE shop (
//   article INT(4) UNSIGNED ZEROFILL DEFAULT '0000' NOT NULL,
//   dealer  CHAR(20)                 DEFAULT ''     NOT NULL,
//   price   DOUBLE(16, 2)            DEFAULT '0.00' NOT NULL,
//   PRIMARY KEY(article, dealer)
// )
// `

type Props = {
  expand: useExpandResult,
  entities: EntityNodeData[],
  relations: Edge<any>[]
}

//*============================== Creates
function sqlColumn(column: EntityNodeDataColumn) {
  let result = `${column.name} ${column.type}`
  if (column.options?.["default"]) result += ` DEFAULT '${column.options?.["default"]}'`
  if (column.options?.["db_options"])
    console.log(column.options?.["db_options"]);
  //TODO: добавить options
  return result
}
function sqlPK(entity: EntityNodeData) {
  let result: string | string[] = entity.columns.filter(x => x.tableKey.isPK).map(x => x.name)
  if (result.length > 1) result = `[${result.join(', ')}]`
  return `PRIMARY KEY (${result})`
}
function sqlCreate(entity: EntityNodeData) {
  const columns = entity.columns.map(sqlColumn).join(',\n\t')
  const pk = sqlPK(entity)
  return `
CREATE TABLE ${entity.entity} (
\t${columns},\n\t${pk}
)`
}

//*============================== Mock
function getMock(columns: EntityNodeDataColumn[]) {
  return `()`
}
function sqlInsertMock(entity: EntityNodeData) {

  const mockColumns = entity.columns.filter(x => !x.tableKey.isPK && !x.tableKey.isFK)
  const tableColumns = mockColumns.map(x => x.name).join(', ')

  return `
INSERT into ${entity.entity} (${tableColumns}) values
${new Array(4).fill("").map(() => getMock(entity.columns)).join(',\n')}
`
}

//*============================== FK
function sqlRelation(rel: Edge<any>, entities: EntityNodeData[]) {
  return `
ALTER TABLE Orders
ADD FOREIGN KEY (PersonID) REFERENCES Persons(PersonID);
`
}

const Codebar = ({ entities, relations, expand }: Props) => {
  console.groupCollapsed('Data');
  console.log(entities, relations);
  console.groupEnd();

  //*========= SQL
  let sql = `/* =========== entities =========== */`
  //* create entities
  sql += entities.map(sqlCreate).join('\n')
  //* mock
  sql += `\n\n/* =========== mock =========== */\n`
  sql += entities.map(entity => `/* MOCK ${entity.entity} */${sqlInsertMock(entity)}`).join('\n')
  //* creates relations
  sql += `\n\n/* =========== relations =========== */\n`
  sql += relations.map(rel => sqlRelation(rel, entities)).join('\n')

  return <aside {...expand.container2} className={styles.codebar}>
    <h1>🖄 SWE LCNC SQL </h1>
    <p>Low code back-end solution for database</p>
    {/* SQL code for server */}
    <CodeEditor sql={sql} />
    <button {...expand.trigger} className={styles.expandableTrigger}>
      ♦
    </button>
  </aside>
}

export default Codebar