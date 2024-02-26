export interface IntegratorPermission {
  id: number
  cmnIntegratorId: number
  cmnCompanyId: number
  isActive: boolean
  createdBy: number
  createdDate: Date
  modifiedBy?: number
  modifiedDate?: Date
}
