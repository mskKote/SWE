import { IRequest } from "../Request/IRequest";

export interface IFolder {
  name: string,
  description: string,
  requests: IRequest[]
}
