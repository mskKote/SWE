import { ERequestMethods } from "../../components/requests/Request/ERequestMethods";


export interface methodOption {
  readonly value: string;
  readonly label: string;
}
export function methodsArray(): methodOption[] {
  const result: methodOption[] = []
  for (const method in ERequestMethods)
    result.push({ value: method, label: method })
  return result
}

export function getERequestMethod(str: string): ERequestMethods | null {
  switch (str) {
    case ERequestMethods.POST: return ERequestMethods.POST
    case ERequestMethods.GET: return ERequestMethods.GET
    case ERequestMethods.PUT: return ERequestMethods.PUT
    case ERequestMethods.DELETE: return ERequestMethods.DELETE
    case ERequestMethods.PATCH: return ERequestMethods.PATCH
    case ERequestMethods.HEAD: return ERequestMethods.HEAD
    default: return null
  }
} 