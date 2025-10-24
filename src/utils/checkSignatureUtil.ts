import { ConflictError } from "./errorUtils"

export const checkSignature = (prA: {
    id: number,
    name: string
}, prB: {
    id: number,
    name: string
}) => {
    const isCheck = prA.id === prB.id
    if (!isCheck) {
        throw new ConflictError(`${prA.name} de ID ${prA.id} não tem permissão para modificar/consultar ${prB.name} de ID ${prB.id}`)
    } else {
        return
    }
}