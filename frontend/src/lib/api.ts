import {
  AddMemberPayload,
  AuthResponse,
  Comment,
  CreateCommentPayload,
  CreateProjectPayload,
  CreateTaskPayload,
  LoginPayload,
  Notification,
  ProjectDetail,
  ProjectMemberItem,
  ProjectSummary,
  RegisterPayload,
  Task,
  UpdateCommentPayload,
  UpdateProjectPayload,
  UpdateTaskPayload,
  User,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fretment_token");
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("fretment_token", token);
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("fretment_token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== "undefined" && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/register")) {
      removeToken();
    }
  }

  let data: any = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorMessage =
      data?.message || `Request failed with status ${response.status}`;
    throw new ApiError(errorMessage, response.status);
  }

  return data as T;
}

export const api = {
  auth: {
    login: (payload: LoginPayload): Promise<AuthResponse> =>
      request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    register: (payload: RegisterPayload): Promise<AuthResponse> =>
      request<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    getMe: (): Promise<{ message: string; user: User }> =>
      request<{ message: string; user: User }>("/users/me", {
        method: "GET",
      }),
  },

  projects: {
    list: async (): Promise<ProjectSummary[]> => {
      const res = await request<{ projects: ProjectSummary[] }>("/projects", {
        method: "GET",
      });
      return res.projects;
    },
    get: async (projectId: number): Promise<ProjectDetail> => {
      const res = await request<{ project: ProjectDetail }>(
        `/projects/${projectId}`,
        {
          method: "GET",
        }
      );
      return res.project;
    },
    create: async (payload: CreateProjectPayload): Promise<ProjectDetail> => {
      const res = await request<{ message: string; project: ProjectDetail }>(
        "/projects",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      return res.project;
    },
    update: async (
      projectId: number,
      payload: UpdateProjectPayload
    ): Promise<ProjectDetail> => {
      const res = await request<{ message: string; project: ProjectDetail }>(
        `/projects/${projectId}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );
      return res.project;
    },
    delete: async (projectId: number): Promise<{ message: string }> => {
      return request<{ message: string }>(`/projects/${projectId}`, {
        method: "DELETE",
      });
    },
  },

  members: {
    list: async (projectId: number): Promise<ProjectMemberItem[]> => {
      const res = await request<{ members: ProjectMemberItem[] }>(
        `/projects/${projectId}/members`,
        {
          method: "GET",
        }
      );
      return res.members;
    },
    add: async (
      projectId: number,
      payload: AddMemberPayload
    ): Promise<ProjectMemberItem> => {
      const res = await request<{ message: string; member: ProjectMemberItem }>(
        `/projects/${projectId}/members`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      return res.member;
    },
    remove: async (
      projectId: number,
      userId: number
    ): Promise<{ message: string }> => {
      return request<{ message: string }>(
        `/projects/${projectId}/members/${userId}`,
        {
          method: "DELETE",
        }
      );
    },
  },

  tasks: {
    list: async (projectId: number): Promise<Task[]> => {
      const res = await request<{ tasks: Task[] }>(
        `/projects/${projectId}/tasks`,
        {
          method: "GET",
        }
      );
      return res.tasks;
    },
    get: async (projectId: number, taskId: number): Promise<Task> => {
      const res = await request<{ task: Task }>(
        `/projects/${projectId}/tasks/${taskId}`,
        {
          method: "GET",
        }
      );
      return res.task;
    },
    create: async (
      projectId: number,
      payload: CreateTaskPayload
    ): Promise<Task> => {
      const res = await request<{ message: string; task: Task }>(
        `/projects/${projectId}/tasks`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      return res.task;
    },
    update: async (
      projectId: number,
      taskId: number,
      payload: UpdateTaskPayload
    ): Promise<Task> => {
      const res = await request<{ message: string; task: Task }>(
        `/projects/${projectId}/tasks/${taskId}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );
      return res.task;
    },
    delete: async (
      projectId: number,
      taskId: number
    ): Promise<{ message: string }> => {
      return request<{ message: string }>(
        `/projects/${projectId}/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );
    },
  },

  comments: {
    list: async (projectId: number, taskId: number): Promise<Comment[]> => {
      const res = await request<{ comments: Comment[] }>(
        `/projects/${projectId}/tasks/${taskId}/comments`,
        {
          method: "GET",
        }
      );
      return res.comments;
    },
    create: async (
      projectId: number,
      taskId: number,
      payload: CreateCommentPayload
    ): Promise<Comment> => {
      const res = await request<{ message: string; comment: Comment }>(
        `/projects/${projectId}/tasks/${taskId}/comments`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      return res.comment;
    },
    update: async (
      projectId: number,
      taskId: number,
      commentId: number,
      payload: UpdateCommentPayload
    ): Promise<Comment> => {
      const res = await request<{ message: string; comment: Comment }>(
        `/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );
      return res.comment;
    },
    delete: async (
      projectId: number,
      taskId: number,
      commentId: number
    ): Promise<{ message: string }> => {
      return request<{ message: string }>(
        `/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );
    },
  },

  notifications: {
    list: async (): Promise<Notification[]> => {
      const res = await request<{ notifications: Notification[] }>(
        "/notifications",
        {
          method: "GET",
        }
      );
      return res.notifications;
    },
    markRead: async (notificationId: number): Promise<Notification> => {
      const res = await request<{ notification: Notification }>(
        `/notifications/${notificationId}/read`,
        {
          method: "PATCH",
        }
      );
      return res.notification;
    },
    markUnread: async (notificationId: number): Promise<Notification> => {
      const res = await request<{ notification: Notification }>(
        `/notifications/${notificationId}/unread`,
        {
          method: "PATCH",
        }
      );
      return res.notification;
    },
    markAllRead: async (): Promise<{ count: number }> => {
      return request<{ count: number }>("/notifications/read-all", {
        method: "PATCH",
      });
    },
  },
};

export { ApiError };
