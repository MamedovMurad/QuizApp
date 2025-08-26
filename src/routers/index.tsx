import { lazy, Suspense } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { Spin } from 'antd';
import PricingPage from '../pages/pricing';
import PricingList from '../pages/admin/pricing';
import PaymentSuccess from '../pages/payment/PaymentSuccess';
import PaymentFailed from '../pages/payment/PaymentFailed';
import { EditQuestionEditForm } from '../pages/admin/questions/edit-question/QuestionForm';
import PromoList from '../pages/admin/promo-codes';
import RegisterPage from '../pages/register';

// Wrapper
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className=' h-full w-full flex justify-center items-center'><Spin size='large' /></div>}>{children}</Suspense>
);

// Lazy load pages
const MainLayout = lazy(() => import('../containers/layouts/MainLayout'));
const CreateQuestion = lazy(() => import('../pages/admin/questions/create-question'));
const StoreQuestion = lazy(() =>
  import('../pages/admin/questions/create-question').then((mod) => {
    if (!mod.StoreQuestion) throw new Error('StoreQuestion tapılmadı!');
    return { default: mod.StoreQuestion };
  })
);
const Questions = lazy(() => import('../pages/admin/questions'));

const GroupList = lazy(() => import('../pages/admin/group'));
const LoginPage = lazy(() => import('../pages/login'));
const HomePage = lazy(() => import('../pages/home'));
const QuizPage = lazy(() => import('../pages/quiz'));
const ExamResultsPage = lazy(() => import('../pages/exam-results'));
const ResultDetailPage = lazy(() => import('../pages/exam-results/detail'));

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
           <Route
        path="/register"
        element={
          <SuspenseWrapper>
            <RegisterPage />
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
            path="/pricing"
            element={
              <SuspenseWrapper>
                <PricingPage />
              </SuspenseWrapper>
            }
          />
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
            path="/payment/success/message"
            element={
              <SuspenseWrapper>
                <PaymentSuccess />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/payment/failed/message"
            element={
              <SuspenseWrapper>
                <PaymentFailed />
              </SuspenseWrapper>
            }
          />
        </Route>





      </Route>


      {/* admin section */}
      <Route
        element={
          <SuspenseWrapper>
            <MainLayout />
          </SuspenseWrapper>
        }
      >

        <Route element={<PrivateRoute role='admin' />}>
          <Route
            path="/admin/quiz/list"
            element={
              <SuspenseWrapper>
                <Questions />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/admin/quiz/create"
            element={
              <SuspenseWrapper>
                <CreateQuestion />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/admin/quiz/create/:id"
            element={
              <SuspenseWrapper>
                <StoreQuestion />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/admin/quiz/edit/:id"
            element={
              <SuspenseWrapper>
                <EditQuestionEditForm />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/admin/groups"
            element={
              <SuspenseWrapper>
                <GroupList />
              </SuspenseWrapper>
            }
          />
          <Route
            path="/admin/pricings"
            element={
              <SuspenseWrapper>
                <PricingList />
              </SuspenseWrapper>
            }
          />

          <Route
            path="/admin/promos"
            element={
              <SuspenseWrapper>
                <PromoList />
              </SuspenseWrapper>
            }
          />
        </Route>
      </Route>
    </>
  )
);
