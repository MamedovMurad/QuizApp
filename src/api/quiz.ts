import type { PaginatedResponse, QuestionResponse } from "../models/quiz";
import api from "./agent";

export async function startQuizApi(id: string | number) {
  try {
    const response = await api.post('/session-store', { category_id: id })
    const token = response.data.token
    console.log(token,);
    if (token) {
      // navigate("/quiz/"+token);
    }

    return response.data.token
  } catch (error) {
    throw error
  }
}

const getQuizes = (token: string) => {
  return api.get("/questions/" + token)
}
const getGroups = () => {
  return api.get("/admin/group")
}


const creategroup = (values: any) => {
  return api.post("/admin/group", values);
};
const updategroup = (values: any, id: number | string) => {
  return api.post("/admin/group/" + id, values);
};
const deletegroup = (id: string | number) => {
  return api.delete("/admin/group/" + id);
};

const getQuizSessions = () => {
  return api.get("/get-exam-sessions")
}

const getResults = (id: string | number) => {
  return api.get("/get-results/" + id)
}

const getCategories = () => {
  return api.get("/categories")
}
const postQuizes = (token: string, answers: Record<number, any>) => {
  return api.post('/submit-quiz/' + token, answers);
};

const createQuiz = (values: any) => {
  return api.post('/admin/question-store', values);
};
const updateQuiz = (values: any, id: string | number) => {
  return api.post('/admin/question-update/' + id, values);
};
const deleteQuiz = (id: string | number) => {
  return api.delete('/admin/question-delete/' + id);
};

const getAllQuizes = async (page: number = 1, pageSize: number = 25): Promise<PaginatedResponse<QuestionResponse>> => {
  return api.get(`/admin/questions?page=${page}&limit=${pageSize}`).then(res => res.data);
}
const getQuizById = (id: string | number) => {
  return api.get("/admin/question-edit/" + id)
}


export {
  getQuizes,
  postQuizes,
  getQuizSessions,
  getResults,
  getCategories,
  createQuiz,
  getAllQuizes,
  getGroups,
  getQuizById,
  creategroup,
  updategroup,
  deletegroup,
  updateQuiz,
  deleteQuiz
}