export interface Integrator {
    id: number
    name: string
    cmnServiceTypeId: number
    isActive: boolean
    createdBy: number
    createdDate: Date
    modifiedBy?: number
    modifiedDate?: Date
}
