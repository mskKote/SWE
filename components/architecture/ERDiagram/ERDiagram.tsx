import React, { useEffect, useCallback, ReactNode, useMemo, Dispatch, SetStateAction } from 'react';
import ReactFlow, { addEdge, MiniMap, Controls, Connection, Edge, NodeTypes, Background, Node, EdgeTypes, NodeChange, EdgeChange } from 'react-flow-renderer';
import { mockEntityDataArray, mockRelationArray } from './mock';

import styles from "./EntityNode/EntityNode.module.scss"
import diagramStyles from "./ERDiagram.module.scss"

import { EntityNodeData } from './EntityNode/EntityNodeDataType';
import EntityNode from './EntityNode/EntityNode';
import RelationEdge, { RelationEdgeProps } from './relationEdge/RelationEdge';
import { EEdgeRelations } from './relationEdge/RelationEdgeDataType';
import { relationAnimationMapper, connectionLineStyle, createEdge } from '../../../utils/ERDiagram/edgeUtils';
import { createEntity } from '../../../utils/ERDiagram/nodeUtils';


//* Types for ER diagram state
export type nodeState = {
  nodes: Node<EntityNodeData>[],
  setNodes: Dispatch<SetStateAction<Node<EntityNodeData>[]>>,
  onNodesChange: (changes: NodeChange[]) => void,
}

export type edgeState = {
  edges: Edge<any>[],
  setEdges: Dispatch<SetStateAction<Edge<any>[]>>,
  onEdgesChange: (changes: EdgeChange[]) => void,
}
//*=========================

type Props = {
  nodeFuncsData: EntityNodeData["funcs"]
}

const ERDiagram = ({ nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange, nodeFuncsData }: Props & nodeState & edgeState) => {

  //* Memoization
  const nodeTypes = useMemo<NodeTypes>(() => ({ entityNode: EntityNode as unknown as ReactNode }), [])
  const edgeTypes = useMemo<EdgeTypes>(() => ({ relationEdge: RelationEdge as unknown as ReactNode }), [])

  //*========================== Relations
  function changeEdgeRelation(id: string) {
    setEdges(edges => edges.map(edge => {
      // Search for concrete entity
      if (edge.id !== id) return edge
      // Change relation
      if (edge.label === EEdgeRelations.OneToOne)
        return { ...edge, ...relationAnimationMapper[EEdgeRelations.OneToMany] }
      else if (edge.label === EEdgeRelations.OneToMany)
        return { ...edge, ...relationAnimationMapper[EEdgeRelations.ManyToOne] }
      else
        return { ...edge, ...relationAnimationMapper[EEdgeRelations.OneToOne] }
    }))
  }
  function deleteEdge(id: string) {
    setEdges(edges => edges.filter(edge => edge.id !== id))
    setNodes(nodes => {
      const _nodes = nodes.map(node => {
        const newColumns = node.data.columns.map(column => ({ ...column, tableKey: { ...column.tableKey, isFK: false } }))
        return { ...node, data: { ...node.data, columns: newColumns } }
      })
      for (const edge of edges) {
        if (edge.id === id) continue
        _nodes[+edge.source].data.columns[+edge.sourceHandle!.slice(7)].tableKey.isFK = true
        _nodes[+edge.target].data.columns[+edge.targetHandle!.slice(7)].tableKey.isFK = true
      }
      return _nodes
    })
  }
  const edgeFuncsData = useMemo(() => ({ changeEdgeRelation, deleteEdge }), [])
  const defaultEdges = useMemo<Array<Edge<RelationEdgeProps["data"]>>>(() => {
    return mockRelationArray.map(_edge => ({ ..._edge, data: edgeFuncsData }))
  }, [])
  //*========================== Entities
  const defaultNodes = useMemo<Array<Node<EntityNodeData>>>(() => {
    return mockEntityDataArray.map((entityNodeData, i) =>
      createEntity(`${i}`, entityNodeData, nodeFuncsData))
  }, [])

  useEffect(() => {
    setEdges(defaultEdges)
    setNodes(defaultNodes)
  }, []);

  const onConnect = useCallback(
    ({ source, sourceHandle, target, targetHandle }: Connection) => {
      // No circles
      if (source === target) return
      // Add FK to source and target
      // console.group("onConnect")
      // console.log(source, sourceHandle); // 3 source-2
      // console.log(target, targetHandle); // 0 target-1
      // console.groupEnd()
      const sourceColumn = sourceHandle?.slice(7)
      const targetColumn = targetHandle?.slice(7)

      setNodes(_nodes => _nodes.map(_node => {
        if (_node.id === source) {
          const newColumns = [..._node.data.columns]
          newColumns[Number(sourceColumn)] = {
            ...newColumns[Number(sourceColumn)],
            tableKey: {
              isPK: newColumns[Number(sourceColumn)].tableKey.isPK,
              isFK: true
            }
          }
          return { ..._node, data: { ..._node.data, columns: newColumns } }
        }
        if (_node.id === target) {
          const newColumns = [..._node.data.columns]
          newColumns[Number(targetColumn)] = {
            ...newColumns[Number(targetColumn)],
            tableKey: {
              isPK: newColumns[Number(targetColumn)].tableKey.isPK,
              isFK: true
            }
          }
          return { ..._node, data: { ..._node.data, columns: newColumns } }
        }
        return _node
      }))
      setEdges(_edges =>
        addEdge(
          createEdge(
            { entity: source as string, handle: sourceColumn as string },
            { entity: target as string, handle: targetColumn as string },
            EEdgeRelations.OneToOne,
            edgeFuncsData),
          _edges))
    },
    []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onConnect={onConnect}
      connectionLineStyle={connectionLineStyle}
      snapToGrid={true}
      snapGrid={[20, 20]}
      deleteKeyCode={null}
      defaultZoom={1.5}
      fitView
      className={styles.ERDiagram}
      attributionPosition={"top-right"}
    >
      <Background />
      <MiniMap nodeColor={'#1A192B'} className={diagramStyles.minimap} />
      <Controls />
    </ReactFlow>)
}

export default ERDiagram;