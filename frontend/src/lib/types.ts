export type ProjectRole = "OWNER" | "MEMBER";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type NotificationType =
  | "TASK_ASSIGNED"
  | "COMMENT_ADDED"
  | "PROJECT_MEMBER_ADDED"
  | "TASK_STATUS_CHANGED";

export interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt: string;
}

export interface UserSummary {
  id: number;
  username: string;
  email?: string;
  avatarUrl?: string | null;
}

export interface ProjectSummary {
  id: number;
  name: string;
  description?: string | null;
  color?: string | null;
  createdAt: string;
  role: ProjectRole;
}

export interface ProjectMemberItem {
  id: number;
  role: ProjectRole;
  joinedAt?: string;
  user: UserSummary;
}

export interface ProjectDetail {
  id: number;
  name: string;
  description?: string | null;
  color?: string | null;
  createdAt: string;
  updatedAt?: string;
  owner?: UserSummary;
  members: ProjectMemberItem[];
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: number;
  creator: UserSummary;
  assignee: UserSummary | null;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: UserSummary;
}

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  referenceId?: number | null;
  isRead: boolean;
  createdAt: string;
  actor?: {
    id: number;
    username: string;
    avatarUrl?: string | null;
  } | null;
}

// Request Payload Types
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user: User;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  color?: string;
}

export interface AddMemberPayload {
  email: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  dueDate?: string;
  assigneeId?: number;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeId?: number;
}

export interface CreateCommentPayload {
  content: string;
}

export interface UpdateCommentPayload {
  content: string;
}
