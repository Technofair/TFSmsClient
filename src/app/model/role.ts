export interface Role {
    id: number;
    name: string;
    isActive: boolean;
    createdBy: number;
    createdDate: string;
    modifiedBy?: number;
    modifiedDate?: string;
  }
  