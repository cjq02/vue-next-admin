namespace User {

  export type ICorpVO = {
    address: string;
    children: any[];
    code: string;
    contactPerson: string;
    corpEmail: string;
    corpId: string;
    corpType: string;
    createTs: string;
    createUserId: string;
    currentCorpId: string;
    delFlag: string;
    id: string;
    isActive: string;
    manageArea: number;
    manageCity: number;
    manageProvince: number;
    mineTypeName: string;
    name: string;
    parentCorpId: string;
    parentName: string;
    phone: string;
    rowNo: number;
    rowState: number;
    shortName: string;
    tin: string;
    updateTs: string;
    updateUserId: string;
  }

  export type IUserVO = {
    active: string;
    contact: string;
    corpId: string;
    ICorpVO: ICorpVO;
    corpName: string;
    createTs: string;
    createUserId: string;
    delFlag: string;
    delTs: string;
    delUserId: string;
    departmentId: string;
    deptId: string;
    deptName: string;
    email: string;
    excludeSuperAdmin: string;
    id: string;
    isDefaultPwd: string;
    jobNo: string;
    lastLoginIp: string;
    lastLoginTs: string;
    password: string;
    permissions: any[];
    phone: string;
    photoId: string;
    realName: string;
    roleId: string;
    roleIds: any[];
    roleName: string;
    roleNames: any[];
    roleTypes: any[];
    rowNo: number;
    rowState: number;
    salt: string;
    updateTs: string;
    updateUserId: string;
    userName: string;
    userType: string;
  }

  type TUser = Partial<IUserVO>
  type TCorp = Partial<ICorpVO>

}
