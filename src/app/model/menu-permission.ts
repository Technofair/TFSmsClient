export interface MenuPermission {
    id: number;
    title: string;
    secRoleId?: number;
    secUserId?: number;
    secMenuId: number;
    add: boolean;
    read: boolean;
    edit: boolean;
    delete: boolean;
    print: boolean;
    isActive: boolean;
    createdBy: number;
    createdDate: Date;
    modifiedBy?: number;
    modifiedDate?: Date;
}
