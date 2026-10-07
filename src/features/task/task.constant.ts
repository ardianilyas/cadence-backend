export const TASK_NOT_FOUND = "Task not found";

export const TASK_ERROR_VALIDATION = {
  ID: "Invalid task id format",
  TITLE: {
    MIN: "Title must be at least 3 characters long",
    MAX: "Title must be at most 30 characters long",
  },
  DESCRIPTION: {
    MIN: "Description must be at least 3 characters long",
    MAX: "Description must be at most 200 characters long"
  },
  DUE_DATE: {
    MIN: "Due date must be in the future"
  },
  PROJECT_ID: {
   UUID: "Invalid project id format"
  },
  ASSIGNEE_ID: {
    UUID: "Invalid assignee id format"
  }
}

export const TASK_TEST_ROUTE = {
  GET_TASKS_BY_PROJECT_ID: (projectId: string) => `/api/projects/${projectId}/tasks`,
  GET_TASK: (projectId: string, id: string) => `/api/projects/${projectId}/tasks/${id}`,
  CREATE_TASK: (projectId: string) => `/api/projects/${projectId}/tasks`,
  UPDATE_TASK: (projectId: string, id: string) => `/api/projects/${projectId}/tasks/${id}`,
  DELETE_TASK: (projectId: string, id: string) => `/api/projects/${projectId}/tasks/${id}`
}

export const TASK_SUCCESS_MESSAGE = {
  GET_TASKS_BY_PROJECT_ID: "Tasks fetched",
  GET_TASK: "Task fetched",
  CREATE_TASK: "Task created",
  UPDATE_TASK: "Task updated",
}
