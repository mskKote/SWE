export function createFolder(name: string, description: string) {
  return {
    name,
    description,
    requests: []
  }
}