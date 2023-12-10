import { Edge } from "react-flow-renderer";
import { createEdge } from "../../../utils/ERDiagram/edgeUtils";
import { createColumn, createEntityData } from "../../../utils/ERDiagram/nodeUtils";
import { EntityNodeData } from "./EntityNode/EntityNodeDataType";
import { EPostgresTypes } from "./EPostgresTypes";
import { RelationEdgeProps } from "./relationEdge/RelationEdge";
import { EEdgeRelations } from "./relationEdge/RelationEdgeDataType";

//*==================================== MOCK entities
export const mockEntityDataArray: EntityNodeData[] = [
  createEntityData("Products", [
    createColumn(true, true, "ProductID", EPostgresTypes.bigserial),
    createColumn(false, false, "ProductName", EPostgresTypes.text, { amount: 255 }),
    createColumn(false, true, "SupplierID", EPostgresTypes.bigserial),
    createColumn(false, true, "CategoryID", EPostgresTypes.bigserial)
  ]),
  createEntityData("Suppliers", [
    createColumn(true, true, "SupplierID", EPostgresTypes.bigserial),
    createColumn(false, false, "CompanyName", EPostgresTypes.text, { amount: 255 }),
    createColumn(false, false, "ContactName", EPostgresTypes.text, { amount: 255 }),
    createColumn(false, false, "Address", EPostgresTypes.text, { amount: 255 })
  ]),
  createEntityData("Categories", [
    createColumn(true, true, "CategoryID", EPostgresTypes.bigserial),
    createColumn(false, false, "CategoryName", EPostgresTypes.text, { amount: 255 }),
    createColumn(false, false, "Description", EPostgresTypes.text, { amount: 255 }),
    createColumn(false, false, "Picture", EPostgresTypes.text, { amount: 255 })
  ]),
  createEntityData("OrderDetails", [
    createColumn(true, true, "OrderID", EPostgresTypes.bigserial),
    createColumn(false, true, "ProductID", EPostgresTypes.bigserial),
    createColumn(false, false, "UnitPrice", EPostgresTypes.bigint),
    createColumn(false, false, "Quantity", EPostgresTypes.bigint),
    createColumn(false, false, "Discount", EPostgresTypes.bigint)
  ])
]

//*==================================== MOCK relations
export const mockRelationArray: Edge<RelationEdgeProps["data"]>[] = [
  createEdge({ entity: "0", handle: "2" }, { entity: "1", handle: "0" }, EEdgeRelations.ManyToOne),
  createEdge({ entity: "0", handle: "3" }, { entity: "2", handle: "0" }, EEdgeRelations.OneToOne),
  createEdge({ entity: "3", handle: "1" }, { entity: "0", handle: "0" }, EEdgeRelations.OneToMany),
]
