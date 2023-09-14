export function updateSuccessful(detail: string) {
  return `${detail} actualizado con éxito`;
}
export function createSuccessful(detail: string) {
  return `${detail} creado con éxito`;
}
export function deleteSuccessful(detail: string) {
  return `${detail} eliminado o desactivado con éxito`;
}
export function updateFailed(detail: string) {
  return `${detail} ha fallado al actualizarse`;
}
export function createFailed(detail: string) {
  return `${detail} ha fallado al registrase`;
}
export function deleteFailed(detail: string) {
  return `${detail} ha fallado al eliminarse o desactivarse`;
}
