import React, { InputHTMLAttributes, useState } from 'react';
import Select, { StylesConfig } from 'react-select'
import { Handle, Position } from 'react-flow-renderer';
import { EntityNodeData, EntityNodeDataColumn } from './EntityNodeDataType';
import { EPostgresTypes } from '../EPostgresTypes';
import styles from './EntityNode.module.scss';

//* ENTITY TYPES
interface typeOption {
  readonly value: string;
  readonly label: string;
}
function typesArray(): typeOption[] {
  const result: typeOption[] = []
  for (const postgresType in EPostgresTypes)
    result.push({ value: postgresType, label: postgresType })
  return result
}

//* MOCK
interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}
const colourOptions: ColourOption[] = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' },
];

interface ColumnOptions {
  readonly value: string;
  readonly label: string;
  readonly mock: boolean;
}

const columnOptions: ColumnOptions[] = [
  { value: 'NOT NULL', label: 'NOT NULL', mock: false },
  { value: 'UNIQUE', label: 'UNIQUE', mock: false },
  { value: 'address', label: 'address', mock: true },
  { value: 'telephone', label: 'telephone', mock: true },
  { value: 'email', label: 'email', mock: true },
  { value: 'name', label: 'name', mock: true },
]


//* TABLE KEY
interface KeyOption {
  readonly value: string;
  readonly label: string;
  readonly isDisabled?: boolean;
}
const keyOptions: KeyOption[] = [
  { value: "", label: "" },
  { value: "isFK", label: "FK", isDisabled: true },
  { value: "isPK", label: "PK" }
]

function getAll(iter: any) {
  const result = []
  for (const iterator of iter) {
    result.push(iterator)
  }
  return result
}

//* PROPS
export type EntityNode = {
  data: EntityNodeData
  id: string
  type: string
  xPos: number
  yPos: number
  zIndex: number
  selected: boolean
  sourcePosition: string
  targetPosition: string
  dragging: boolean
  isConnectable: boolean
  dragHandle: string
}

function EntityNode({ data, isConnectable, id, dragging }: EntityNode) {
  const { entity, columns, funcs } = data
  const [hideDetails, setHideDetails] = useState(true)
  function toggleDetais() {
    setHideDetails(x => !x)
  }
  const input = (name: string, placeholder: string, onBlur?: InputHTMLAttributes<HTMLInputElement>['onBlur']) =>
    <input
      className={`${styles.text} ${dragging ? styles.dragging : ''}`}
      defaultValue={name}
      placeholder={placeholder}
      disabled={dragging}
      draggable={false}
      onBlur={onBlur}
      style={hideDetails ? { width: "100%", textAlign: "center" } : undefined}
    />
  const selectKey = (tableKey: { isPK: boolean, isFK: boolean }, name: string) => {
    let value: typeOption = { label: "", value: "" }
    if (tableKey.isFK) value = { value: "isFK", label: "FK" }
    if (tableKey.isPK) value = { value: "isPK", label: "PK" }

    const colorStyles: StylesConfig<KeyOption> = {
      singleValue: (styles, { data }) => {
        const color = data.value === "isPK" ? '#ff0055' : '#54585d'
        return { ...styles, color }
      }
    }

    return <Select
      value={value}
      options={keyOptions}
      isSearchable={false}
      isClearable={false}
      styles={colorStyles}
      isDisabled={dragging}
      backspaceRemovesValue
      className={styles.selectType}
      onChange={e => funcs.changeNodeColumn(id, name, false, "tableKey", {
        isPK: (e as typeOption).value === "isPK",
        isFK: tableKey.isFK
      })}
    //{value: 'isPK', label: 'PK'}
    />
  }
  const selectOptions = (options: string, name: string) =>
    <Select
      defaultValue={[] as Array<ColumnOptions>}
      options={columnOptions}
      isClearable={false}
      isMulti
      isDisabled={dragging}
      backspaceRemovesValue
      className={styles.selectOptions}
      onChange={e => funcs.changeNodeColumn(id, name, true, "db_options", [...getAll(e.values())].map(x => x.value))}
    />
  const selectType = (type: string, name: string) => {
    const types = typesArray()
    let current = types.find(({ value }) => value === type) as typeOption
    return <Select
      defaultValue={current}
      options={types}
      isSearchable
      onChange={e => funcs.changeNodeColumn(id, name, false, "type", e?.value ?? '')}
      isDisabled={dragging}
      backspaceRemovesValue
      className={styles.selectType}
    />
  }
  const deleteRow = (name: string, position: number) => {
    return <button
      className={styles.deleteRow}
      onClick={() => funcs.deleteNodeColumn(id, name, position)}
      disabled={dragging}>
      ✖️
    </button>
  }
  const handle = (type: "target" | "source", position: Position, i: number) =>
    <Handle
      type={type}
      position={position}
      id={`${type}-${i}`}
      className={type === "target" ? styles.handleTarget : styles.handleSource}
      isConnectable={isConnectable}
    />
  const columnRow = ({ name, tableKey, type, options }: EntityNodeDataColumn, i: number) =>
    <tr key={name} className={styles.row}>
      <td>
        {handle("target", Position.Left, i)}
        {selectKey(tableKey, name)}
      </td>
      {/* Entity name */}
      <td>
        {input(name, "Column name...",
          ({ target }) => funcs.changeNodeColumn(id, name, false, "name", target.value))}
        {hideDetails && handle("source", Position.Right, i)}
      </td>
      {/* Details: mock, keys, type, default */}
      {!hideDetails && <td>{selectOptions(options, name)} </td>}
      {!hideDetails && <td>{selectType(type, name)} </td>}
      {!hideDetails && <td className={styles.default}>{input("", "...",
        ({ target }) => funcs.changeNodeColumn(id, name, true, "default", target.value))}
      </td>}
      {!hideDetails && <td>{deleteRow(name, i)}{handle("source", Position.Right, i)}</td>}
    </tr>
  const addColumnRow = <tr>
    <td colSpan={hideDetails ? 2 : 5}>
      <button
        className={styles.addColumnBtn}
        onClick={() => funcs.addNodeColumn(id)}>
        + add column
      </button>
    </td>
  </tr>

  //*============= Modal Options
  function yes() {
    funcs.deleteNode(id);
    funcs?.confirmModal?.close()
  }
  function no() {
    funcs?.confirmModal?.close()
  }

  return (<div className={!hideDetails ? 'nowheel' : ''}>
    <h2
      className={styles.entityTitle}>
      {input(entity, "Entity name...", ({ target }) => funcs.changeNodeName(id, target.value))}
      <div className={styles.entityNodeActions}>
        <button
          disabled={dragging}
          onPointerDown={toggleDetais}
          className={styles.hideDetails}
          children={hideDetails ? "🔬" : "🔭"} />
        {!hideDetails &&
          <button
            disabled={dragging}
            onClick={() => funcs?.confirmModal?.show({ yes, no })}
            className={styles.hideDetails}
            children={"🚮"}
          />}
      </div>
    </h2>
    <table className={styles.columns}>
      <thead>
        <tr>
          <th>key</th><th>name</th>
          {!hideDetails && <th>options</th>}
          {!hideDetails && <th>type</th>}
          {!hideDetails && <th>default</th>}
          {!hideDetails && <th>actions</th>}
        </tr>
      </thead>
      <tbody>{columns.map(columnRow)}</tbody>
      <tfoot>{addColumnRow}</tfoot>
    </table>
  </div>);
}

export default React.memo(EntityNode)