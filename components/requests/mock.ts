import { createFolder } from '../../utils/Requests/folderUtils';
import { mockEntityDataArray } from './../architecture/ERDiagram/mock';
import { IFolder } from "./Folder/IFolder"
import { ERequestMethods } from "./Request/ERequestMethods"
import { IRequest } from "./Request/IRequest"

//*========================== REQUESTS
export const mockRequests: IRequest[] = [{
  name: "products",
  description: "",
  url: "http://localhost:3000/products",
  method: ERequestMethods.GET,
  params: [
    { name: "next", value: "10" },
    { name: "offset", value: "0" }
  ],
  body: "",
  entities: mockEntityDataArray[0]
}, {
  name: "category",
  description: "",
  url: "http://localhost:3000/category",
  method: ERequestMethods.GET,
  params: [],
  body: "",
  entities: mockEntityDataArray[2]
}]

//*========================== FOLDERS
export const mockFolders: IFolder[] = new Array(1).fill({})
  .map((_, i) => createFolder(`Folder ${i}`, `Description ${i}`))
  .map((x, _) => ({ ...x, requests: mockRequests }))