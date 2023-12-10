import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import ERDiagram, { edgeState, nodeState } from './ERDiagram/ERDiagram';
import styles from "./Architecture.module.scss"
import { EntityNodeData } from './ERDiagram/EntityNode/EntityNodeDataType';

type Props = {
  nodeFuncsData: EntityNodeData["funcs"]
}

const Architecture = (props: Props & nodeState & edgeState) => {

  return <Droppable droppableId='ARCHITECTURE'>
    {({ innerRef, droppableProps, placeholder }) =>
      <section {...droppableProps} ref={innerRef} className={styles.arhitecture}>
        <ERDiagram {...props} />
        {placeholder}
      </section>}
  </Droppable>
}

export default Architecture