import { useEffect, useState } from "react";



import { Layout, Typography, message } from "antd";
import type { Question } from "../../models/quiz";
import QuizForm from "../../containers/QuizForm";
import { useNavigate, useParams } from "react-router-dom";
import { getQuizes, postQuizes } from "../../api/quiz";




const { Header, Content } = Layout;
const { Title } = Typography;

function QuizPage() {
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const handleComplete = (answers: Record<string, any>) => {
    console.log('Final Answers:', answers);
if (token) {
   postQuizes(token,answers).then(()=>{
    message.success('Successfully inserted!')
      navigate("/quiz/results")
   })
}
   
  };
console.log(token);



  useEffect(() => {
    getQuizes(token || "").then((data) => {
      const list = data.data || [];
      if (!list.length) {
        // boşdursa ana səhifəyə qaytar
        navigate("/", { replace: true });
      } else {
        setQuestions(list);
      }
    });
  }, [token, navigate]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <Title level={3} style={{ color: "#fff", margin: 0 }}>Quiz App</Title>
      </Header>
      <Content style={{ padding: 24 }}>
       {questions&& <QuizForm questions={questions} onFinish={handleComplete} />}

      </Content>
    </Layout>
  );
}

export default QuizPage;
