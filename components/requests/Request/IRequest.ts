import { EntityNodeData } from "../../architecture/ERDiagram/EntityNode/EntityNodeDataType"
import { ERequestMethods } from "./ERequestMethods"

export interface IParam {
  name: string,
  value: string
}

export interface IRequest {
  name: string,
  description: string,
  url: string,
  method: ERequestMethods,
  params: IParam[]
  body: string,
  entities?: EntityNodeData
}