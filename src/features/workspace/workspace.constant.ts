export const WORKSPACE_NOT_FOUND = "Workspace not found";

export const WORKSPACE_ERROR_VALIDATION = {
  ID: "Invalid workspace id format",
  NAME: {
    MIN: "Name must be at least 3 characters long",
    MAX: "Name must be at most 50 characters long",
  },
  DESCRIPTION: {
    MIN: "escription must be at least 3 characters long",
  }
}

export const MEMBER_SUCCESS_MESSAGE = {
  ADD_MEMBER_TO_WORKSPACE: "Member added to workspace",
}

export const WORKSPACE_SUCCESS_MESSAGE = {
  GET_WORKSPACE_BY_USER_ID: "Workspaces retrieved successfully",
  GET_WORKSPACE: "Workspace retrieved successfully",
  CREATE_WORKSPACE: "Workspace created successfully",
  UPDATE_WORKSPACE: "Workspace updated successfully",
}

const WORKSPACE_ROUTE_PREFIX = '/api/workspaces';

export const WORKSPACE_TEST_ROUTE = {
  GET_WORKSPACES: `${WORKSPACE_ROUTE_PREFIX}`,
  GET_WORKSPACE: (id: string) => `${WORKSPACE_ROUTE_PREFIX}/${id}`,
  CREATE_WORKSPACE: `${WORKSPACE_ROUTE_PREFIX}`,
  UPDATE_WORKSPACE: (id: string) => `${WORKSPACE_ROUTE_PREFIX}/${id}`,
  DELETE_WORKSPACE: (id: string) => `${WORKSPACE_ROUTE_PREFIX}/${id}`,
  ADD_WORKSPACE_MEMBER: (id: string) => `${WORKSPACE_ROUTE_PREFIX}/${id}/members`,
}

