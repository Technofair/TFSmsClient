export interface Company {
    id: number
    code: string
    name: string
    shortName?: string
    address: string
    contactPerson: string
    contactNo: string
    alternatePhone?: string
    email: string
    cmnCompanyId?: number
    cmnCompanyTypeId: number
    cmnCountryId?: number
    cmnDivisionId?: number
    cmnDistrictId?: number
    cmnUpazillaId?: number
    cmnUnionId?: number
    commissionAmount?:number
    zip?: string
    fax: string
    web: string
    logo?: string
    prefix?: string
    isActive: boolean
    createdBy: number
    createdDate: Date
    modifiedBy?: number
    modifiedDate?: Date
    effectDate?:Date
    scpPackageId?:number
    rate?:number
    scpClientPackageId?:number
}
