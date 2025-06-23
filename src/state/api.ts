import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}


export enum Priority {
  Urgent = "Urgent", 
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}


export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}


export interface User {
  userId?: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  cognitoId?: string;
  teamId?: string;
}


export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}


export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId?: number;
  authorUserId?: number;
  assignedUserId?: number;


  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface SearchResult {
  tasks? : Task[];
  project? : Project[];
  users? : User[];
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks"],
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      // 데이터를 검색하여 받아오는 요청에 일반적으로 사용이 권장된다.
      query: () => "projects",
      providesTags: ["Projects"],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      // mutation: 캐시 된 데이터를 무효화하고 강제로 다시 가져올 수 있기 때문에 데이터 업데이트나 생성에 보내고 변경 사항을 로컬 캐시에 적용할 때 사용한다.
      // Partial: <>로 지정된 객체의 데이터를 모두 optional로 설정하여 사용한다.
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      // tag는 각 요청마다 캐싱된 데이터의 이름을 뜻한다.
      // invalidatesTags를 사용하면 기존에 요청한 결과 캐시를 없애고 해당 태그에 대한 요청을 다시 보낼 수 있습니다
      invalidatesTags: ["Projects"],
    }),
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),

    search: build.query<SearchResult, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});


export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useCreateTaskMutation,
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
  useSearchQuery,
} = api;




