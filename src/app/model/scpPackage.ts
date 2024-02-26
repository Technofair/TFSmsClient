export interface ScpPackage {
  id: number
  cmnCompanyId: number
  cmnServiceTypeId: number
  cmnIntegratorPackageId: number
  commissionAmount:number
  name: string
  display:string
  numberOfChannels: number
  price: number
  period: number
  isBasic: number
  isFree: number
  maxFreeDays: number
  isAutoRefund: number
  isActive: boolean
  createdBy: number
  createdDate: Date
  modifiedBy?: number
  modifiedDate?: Date
}
