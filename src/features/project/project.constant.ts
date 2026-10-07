export const PROJECT_NOT_FOUND = "Project not found";

export const PROJECT_TEST_ROUTE = {
  GET_PROJECTS_BY_WORKSPACE_ID: (workspaceId: string) => `/api/workspaces/${workspaceId}/projects`,
  GET_PROJECT_BY_ID: (workspaceId: string, id: string) => `/api/workspaces/${workspaceId}/projects/${id}`,
  CREATE_PROJECT: (workspaceId: string) => `/api/workspaces/${workspaceId}/projects`,
  UPDATE_PROJECT: (workspaceId: string, id: string) => `/api/workspaces/${workspaceId}/projects/${id}`,
  DELETE_PROJECT: (workspaceId: string, id: string) => `/api/workspaces/${workspaceId}/projects/${id}`,
}
