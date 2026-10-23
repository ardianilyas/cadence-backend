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
  REMOVE_MEMBER_TO_WORKSPACE: "Member removed to workspace",
  GET_USERS_NOT_IN_WORKSPACE: "Users not in workspace retrieved successfully",
  GET_WORKSPACE_MEMBERS: "Workspace members retrieved successfully",
}

export const WORKSPACE_SUCCESS_MESSAGE = {
  GET_WORKSPACE_BY_USER_ID: "Workspaces retrieved successfully",
  GET_WORKSPACE: "Workspace retrieved successfully",
  CREATE_WORKSPACE: "Workspace created successfully",
  UPDATE_WORKSPACE: "Workspace updated successfully",
}

export const WORKSPACE_FORBIDDEN_MESSAGE = {
  UPDATE: "You can't modified this workspace",
  DELETE: "You can't delete this workspace"
}

const WORKSPACE_ROUTE_PREFIX = '/api/workspaces';

export const WORKSPACE_TEST_ROUTE = {
  GET_WORKSPACES: `${WORKSPACE_ROUTE_PREFIX}`,
  GET_WORKSPACE: (id: string) => `${WORKSPACE_ROUTE_PREFIX}/${id}`,
  CREATE_WORKSPACE: `${WORKSPACE_ROUTE_PREFIX}`,
  UPDATE_WORKSPACE: (id: string) => `${WORKSPACE_ROUTE_PREFIX}/${id}`,
  DELETE_WORKSPACE: (id: string) => `${WORKSPACE_ROUTE_PREFIX}/${id}`,
  GET_AVAILABLE_USERS: (id: string) => `${WORKSPACE_ROUTE_PREFIX}/${id}/available-users`,
  GET_WORKSPACE_MEMBERS: (id: string) => `${WORKSPACE_ROUTE_PREFIX}/${id}/members`,
  ADD_WORKSPACE_MEMBER: (id: string) => `${WORKSPACE_ROUTE_PREFIX}/${id}/members`,
  REMOVE_MEMBER_TO_WORKSPACE: (id: string, memberId: string) => `${WORKSPACE_ROUTE_PREFIX}/${id}/members/${memberId}`,
}
