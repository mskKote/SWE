import React, { MouseEvent } from 'react';
import { getEdgeCenter, getMarkerEnd, getSmoothStepPath, Position } from 'react-flow-renderer';
import styles from './RelationEdge.module.scss';

const foreignObjectWidth = 35;
const foreignObjectHeight = 21;

export type RelationEdgeProps = {
  id: string
  source: string
  target: string
  selected: boolean
  animated: boolean
  label: string
  labelStyle: any
  labelShowBg: boolean
  labelBgStyle: any
  labelBgPadding: number
  labelBgBorderRadius: number
  data: {
    changeEdgeRelation: (id: string) => void,
    deleteEdge: (id: string) => void
  }
  style: any
  arrowHeadType: 'arrow' | 'arrowclosed'
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
  markerStart: string
  markerEnd: string
}

function RelationEdge({
  id, sourcePosition, targetPosition,
  sourceX, sourceY, //TODO: сделать 2 SVG в этих точках 
  targetX, targetY, //TODO: сделать 2 SVG в этих точках 
  style = {}, markerEnd, label, data
}: RelationEdgeProps) {

  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX, sourceY,
    targetX, targetY,
  });

  function onEdgeClick(evt: MouseEvent<HTMLButtonElement>) {
    evt.stopPropagation();
    data.changeEdgeRelation(id)
  }
  function onEdgeContextMenu(evt: MouseEvent<HTMLButtonElement>) {
    evt.preventDefault()
    data.deleteEdge(id)
  }

  return (<>
    <path
      id={id}
      style={style}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
    />
    <foreignObject
      x={edgeCenterX - foreignObjectWidth / 2}
      y={edgeCenterY - foreignObjectHeight / 2}
      className={styles.edgebuttonForeignObject}
      requiredExtensions="http://www.w3.org/1999/xhtml"
    >
      <button
        className={styles.edgebutton}
        onContextMenu={onEdgeContextMenu}
        onClick={onEdgeClick}
      >
        {label}
      </button>
    </foreignObject>
  </>);
}

export default React.memo(RelationEdge)