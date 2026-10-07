export const PROJECT_NOT_FOUND = "Project not found";

export const PROJECT_ERROR_VALIDATION = {
  ID: "Invalid project id format",
  NAME: {
    REQUIRED: "Name is required",
    MIN: "Name at least 3 characters long",
  },
  DESCRIPTION: {
    REQUIRED: "Description is required",
    MIN: "Description at least 3 characters long"
  },
  START_DATE: {
    MIN: "Start date must be in the future"
  },
  DUE_DATE: {
    MIN: "Due date must be in the future"
  }
}

export const PROJECT_SUCCESS_MESSAGE = {
  GET_PROJECT_BY_WORKSPACE_ID: "Projects retrieved successfully",
  GET_PROJECT_BY_ID: "Project retrieved successfully",
  CREATE_PROJECT: "Project created successfully",
  UPDATE_PROJECT: "Project updated successfully",
}

export const PROJECT_TEST_ROUTE = {
  GET_PROJECTS_BY_WORKSPACE_ID: (workspaceId: string) => `/api/workspaces/${workspaceId}/projects`,
  GET_PROJECT_BY_ID: (workspaceId: string, id: string) => `/api/workspaces/${workspaceId}/projects/${id}`,
  CREATE_PROJECT: (workspaceId: string) => `/api/workspaces/${workspaceId}/projects`,
  UPDATE_PROJECT: (workspaceId: string, id: string) => `/api/workspaces/${workspaceId}/projects/${id}`,
  DELETE_PROJECT: (workspaceId: string, id: string) => `/api/workspaces/${workspaceId}/projects/${id}`,
}
