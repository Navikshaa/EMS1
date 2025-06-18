const API_BASE_URL = 'http://localhost:3000';
const SOCKET_URL = 'wss://employees.navikshaa.com';

export const API_ENDPOINTS =  {
  // Auth endpoints
  AUTH: {
    VERIFY: `${API_BASE_URL}/api/auth/verify`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
  // Employee endpoints
  EMPLOYEE: {
    BASE: `${API_BASE_URL}/api/employee`,
    GET_ALL: `${API_BASE_URL}/api/employee/add`,
    GET_ONE: (id) => `${API_BASE_URL}/api/employee/${id}`,
    CREATE: `${API_BASE_URL}/api/employee`,
    UPDATE: (id) => `${API_BASE_URL}/api/employee/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/employee/${id}`,
  },

  //Login History endpoints
  LOGIN_HISTORY: {
    BASE: `${API_BASE_URL}/api/login-history`,
    GET_ALL: `${API_BASE_URL}/api/login-history`,
  },
  // Department endpoints
  DEPARTMENT: {
    BASE: `${API_BASE_URL}/api/department`,
    GET_ALL: `${API_BASE_URL}/api/department`,
    GET_ONE: (id) => `${API_BASE_URL}/api/department/${id}`,
  },
  //Summary endpoints
  SUMMARY: {
    BASE: `${API_BASE_URL}/api/dashboard/summary`,
    GET_ALL: `${API_BASE_URL}/api/salary`,

  },

  //LEAVE endpoints
  LEAVE: {
    BASE: `${API_BASE_URL}/api/leave`,
    GET_ALL: `${API_BASE_URL}/api/leave/add`,
    GET_ONE: (id) => `${API_BASE_URL}/api/leave/${id}`,
    CREATE: `${API_BASE_URL}/api/leave`,
    UPDATE: (id) => `${API_BASE_URL}/api/leave/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/leave/${id}`,
  },

  // Admin Edit View 
  ADMIN_EDIT: {
    BASE: `${API_BASE_URL}/api/login-history`,
    GET_ALL: `${API_BASE_URL}/api/admin-edit`,
    GET_ONE: (id) => `${API_BASE_URL}/api/admin-edit/${id}`,
    CREATE: `${API_BASE_URL}/api/admin-edit`,
    UPDATE: (id) => `${API_BASE_URL}/api/admin-edit/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/admin-edit/${id}`,
  },

  //Image Upload
  IMAGE_UPLOAD: {
    BASE: `${API_BASE_URL}/api/uploads`,
    UPLOAD: `${API_BASE_URL}/api/upload/image`,
  },

  //Candidate endpoints
  CANDIDATE: {
    BASE: `${API_BASE_URL}/api/candidate`,
    GET_ALL: `${API_BASE_URL}/api/candidate`,
    GET_ONE: (id) => `${API_BASE_URL}/api/candidate/${id}`,
    CREATE: `${API_BASE_URL}/api/candidates`,
    UPDATE: (id) => `${API_BASE_URL}/api/candidate/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/candidate/${id}`,
  },
  //Leave endpoints
  LEAVE: {
    BASE: `${API_BASE_URL}/api/leave`,
    GET_ALL: `${API_BASE_URL}/api/leave`,
    GET_ONE: (id) => `${API_BASE_URL}/api/leave/${id}`,
    CREATE: `${API_BASE_URL}/api/leave`,
    UPDATE: (id) => `${API_BASE_URL}/api/leave/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/leave/${id}`,
  },

  //Group endpoints
  GROUP: {
    BASE: `${API_BASE_URL}/api/group`,
    GET_ALL: `${API_BASE_URL}/api/group/add`,
    BASE_GROUP: `${API_BASE_URL}/api/group/my-groups`,
  },

  //Message endpoints
  MESSAGE: {
    BASE: `${API_BASE_URL}/api/messages`,
    GET_ALL: (groupId) => `${API_BASE_URL}/api/message/${groupId}`,
    CREATE: `${API_BASE_URL}/api/message`,
    DELETE: (id) => `${API_BASE_URL}/api/message/${id}`,
  },

  //Paasword endpoints
  PASSWORD: {
    BASE: `${API_BASE_URL}/api/password`,
    UPDATE: `${API_BASE_URL}/api/setting/change-password`,
  },

  //PF endpoints
  PF: {
    BASE: `${API_BASE_URL}/api/pf`,
    GET_ALL: `${API_BASE_URL}/api/pf`,
    GET_ONE: (id) => `${API_BASE_URL}/api/pf/${id}`,
    CREATE: `${API_BASE_URL}/api/pf`,
    UPDATE: (id) => `${API_BASE_URL}/api/pf/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/pf/${id}`,
  },

  //Salary endpoints
  SALARY: {
    BASE: `${API_BASE_URL}/api/salary`,
    GET_ALL: `${API_BASE_URL}/api/salary/add`,
    GET_ONE: (id) => `${API_BASE_URL}/api/salary/${id}`,
    CREATE: `${API_BASE_URL}/api/salary`,
    UPDATE: (id) => `${API_BASE_URL}/api/salary/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/salary/${id}`,
  },

  //Chat endpoints
  CHAT: {
    BASE: `${API_BASE_URL}/api/direct-chats`,
    GET_ALL: `${API_BASE_URL}/api/direct-messages`,
    CREATE: `${API_BASE_URL}/api/chat`,
    DELETE: (id) => `${API_BASE_URL}/api/chat/${id}`,
  },
  // Socket URL
  SOCKET: SOCKET_URL,
};

export const axiosConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default API_ENDPOINTS;
