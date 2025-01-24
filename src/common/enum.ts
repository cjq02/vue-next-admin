/* eslint-disable */
/*
* 后端服务生成，不可修改
* */
const Enum = {
    
    /*
    * 公告状态
    * */
    announceStatus: {
        /* 未发布 */
        _0: '0',
        /* 已发布 */
        _1: '1',
    },

    /*
    * 码表枚举匹配状态
    * */
    codeModifyStatus: {
        /* 枚举新增 - success */
        ADD: '1',
        /* 枚举修改 - warning */
        UPDATE: '2',
        /* 已同步数据 - green */
        GENERATED: '3',
        /* 枚举未改动 - black */
        NORMAL: '4',
        /* 仅存在码表 - gray */
        ENUM_NOT_EXISTS: '5',
    },

    /*
    * 错误代码
    * */
    errorCode: {
        /* 用户会话状态失效，请重新登录！ */
        USER_SESSION_ERROR: '1000',
    },

    /*
    * 文件上传类型
    * */
    fileBizType: {
        /* 管理制度 */
        _1: '1',
    },

    /*
    * 角色类型
    * */
    roleType: {
        /* 超级管理员 */
        _01: '01',
        /* 普通管理员 */
        _02: '02',
        /* 普通用户 */
        _09: '09',
    },

    /*
    * 是否
    * */
    yesNo: {
        /* 是 */
        YES: '1',
        /* 否 */
        NO: '0',
    },

};

export default Enum;