import { RelationEdgeProps } from './../../components/architecture/ERDiagram/relationEdge/RelationEdge';
import { EEdgeRelations } from "../../components/architecture/ERDiagram/relationEdge/RelationEdgeDataType"
import { Edge } from 'react-flow-renderer';

const defaultEdgeFuncs: RelationEdgeProps["data"] = {
  changeEdgeRelation: (id: string) => { },
  deleteEdge: (id: string) => { }
}

export function createEdge(
  source: { entity: string, handle: string },
  target: { entity: string, handle: string },
  relation: EEdgeRelations = EEdgeRelations.OneToOne,
  funcs: RelationEdgeProps["data"] = defaultEdgeFuncs
): Edge<RelationEdgeProps["data"]> {
  return {
    id: `e-${source.entity}|${source.handle}-${target.entity}|${target.handle}`,
    source: source.entity,
    target: target.entity,
    sourceHandle: `source-${source.handle}`,
    targetHandle: `target-${target.handle}`,
    type: 'relationEdge',
    data: funcs,
    ...relationAnimationMapper[relation]
  }
}

export const connectionLineStyle = { stroke: '#000' };

export const relationAnimationMapper = {
  [EEdgeRelations.OneToOne]: { animated: false, label: EEdgeRelations.OneToOne, style: { ...connectionLineStyle, animationName: "dashdrawStop" } },
  [EEdgeRelations.OneToMany]: { animated: true, label: EEdgeRelations.OneToMany, style: { ...connectionLineStyle, animationName: "dashdraw" } },
  [EEdgeRelations.ManyToOne]: { animated: true, label: EEdgeRelations.ManyToOne, style: { ...connectionLineStyle, animationName: "dashdrawRevert" } }
}