import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import styles from "./ToolCard.module.scss"

export enum EToolType {
  REQUEST = "REQUEST",
  ENTITY = "ENTITY",
  FOLDER = "FOLDER"
}

type Props = {
  type: EToolType
}

const ToolCard = ({ type }: Props) => {
  let typedCard: JSX.Element | null = null
  let index = null

  //* Cards tsx
  const requestCard =
    <div className={styles.request}>
      <h2>request</h2>
    </div>
  const entityCard =
    <div className={styles.entity}>
      <h2>entity</h2>
    </div>
  const folderCard =
    <div className={styles.folder}>
      <h2>folder</h2>
    </div>

  //* choose type
  switch (type) {
    case EToolType.REQUEST:
      index = 0
      typedCard = requestCard
      break;
    case EToolType.ENTITY:
      index = 1
      typedCard = entityCard
      break;
    case EToolType.FOLDER:
      index = 2
      typedCard = folderCard
      break;
    default:
      index = -1
      break;
  }

  return <Draggable key={index} index={index} draggableId={type}>
    {({ innerRef, draggableProps, dragHandleProps }, snapshot) =>
      <div
        className={styles.toolCard}
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
        style={{
          backgroundColor: snapshot.isDragging
            ? "#000"
            : "transparent",
          color: snapshot.isDragging
            ? "#FFF"
            : "#000",
          ...draggableProps.style
        }}
      >
        {typedCard}
      </div>}
  </Draggable>
}

export default ToolCard