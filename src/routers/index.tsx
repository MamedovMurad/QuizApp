import { lazy, Suspense } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Bütün komponentləri lazy import et
const MainLayout = lazy(() => import("../containers/layouts/MainLayout"));
const CreateQuestion = lazy(() => import("../pages/admin/questions/create-question"));
const StoreQuestion = lazy(() =>
  import("../pages/admin/questions/create-question").then(mod => ({ default: mod.StoreQuestion }))
);
const Questions = lazy(() => import("../pages/admin/questions"));
const EditQuestionEditForm = lazy(() =>
  import("../pages/admin/questions/edit-question/QuestionForm").then(mod => ({ default: mod.EditQuestionEditForm }))
);
const GroupList = lazy(() => import("../pages/admin/group"));

const LoginPage = lazy(() => import("../pages/login"));
const HomePage = lazy(() => import("../pages/home"));
const QuizPage = lazy(() => import("../pages/quiz"));
const ExamResultsPage = lazy(() => import("../pages/exam-results"));
const ResultDetailPage = lazy(() => import("../pages/exam-results/detail"));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>Yüklənir...</div>}>{children}</Suspense>;
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/login"
        element={
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        }
      />
      <Route element={<PrivateRoute />}>
        <Route
          path="/quiz/:token"
          element={
            <SuspenseWrapper>
              <QuizPage />
            </SuspenseWrapper>
          }
        />
        <Route
          element={
            <SuspenseWrapper>
              <MainLayout />
            </SuspenseWrapper>
          }
        >
          <Route
            path="/"
            element={
              <SuspenseWrapper>
                <HomePage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/quiz/results"
            element={
              <SuspenseWrapper>
                <ExamResultsPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/quiz/results/:id"
            element={
              <SuspenseWrapper>
                <ResultDetailPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path="admin/quiz/list"
            element={
              <SuspenseWrapper>
                <Questions />
              </SuspenseWrapper>
            }
          />
          <Route
            path="admin/quiz/create"
            element={
              <SuspenseWrapper>
                <CreateQuestion />
              </SuspenseWrapper>
            }
          />
          <Route
            path="admin/quiz/create/:id"
            element={
              <SuspenseWrapper>
                <StoreQuestion />
              </SuspenseWrapper>
            }
          />
          <Route
            path="admin/quiz/edit/:id"
            element={
              <SuspenseWrapper>
                <EditQuestionEditForm />
              </SuspenseWrapper>
            }
          />
          <Route
            path="admin/groups"
            element={
              <SuspenseWrapper>
                <GroupList />
              </SuspenseWrapper>
            }
          />
        </Route>
      </Route>
    </>
  )
);
