import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import ToolCard, { EToolType } from './tool/ToolCard'
import styles from "./Tools.module.scss"

const Tools = () => {

  return <Droppable droppableId='default'>
    {({ innerRef, droppableProps, placeholder }, snapshot) =>
      <div
        {...droppableProps}
        ref={innerRef}
        className={styles.tools}
      >
        <h1>Tools</h1>
        <ToolCard type={EToolType.ENTITY} />
        <ToolCard type={EToolType.REQUEST} />
        <ToolCard type={EToolType.FOLDER} />
        {placeholder}
      </div>}
  </Droppable>
}

export default Tools