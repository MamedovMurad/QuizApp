import { lazy } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import MainLayout from '../containers/layouts/MainLayout';
import CreateQuestion, { StoreQuestion } from '../pages/admin/questions/create-question';
import Questions from '../pages/admin/questions';
import { EditQuestionEditForm } from '../pages/admin/questions/edit-question/QuestionForm';
import GroupList from '../pages/admin/group';



// Lazy import
const LoginPage = lazy(() => import('../pages/login'));
const HomePage = lazy(() => import('../pages/home'));
const QuizPage = lazy(() => import('../pages/quiz'));
const ExamResultsPage = lazy(() => import('../pages/exam-results'));
const ResultDetailPage = lazy(() => import('../pages/exam-results/detail'));
// Yaxud adın nədirsə

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/quiz/:token" element={<QuizPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz/results" element={<ExamResultsPage />} />
          <Route path="/quiz/results/:id" element={<ResultDetailPage />} />

          <Route path="admin/quiz/list" element={<Questions />} />
          <Route path="admin/quiz/create" element={<CreateQuestion />} />
          <Route path="admin/quiz/create/:id" element={<StoreQuestion />} />
           <Route path="admin/quiz/edit/:id" element={<EditQuestionEditForm />} />
           <Route path="admin/groups" element={<GroupList />} />

        </Route>
      </Route>
    </>
  )
);
