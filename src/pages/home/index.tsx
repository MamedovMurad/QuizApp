import { Button, Spin, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { getCategories, startQuizApi } from "../../api/quiz";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthProvider";
import { messageApi } from "../../context/MessageContext";

export default function StartTestPage() {
  const [categories, setcategories] = useState([]);
  const [loading, setloading] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const confirmStartQuiz = (id: string | number) => {
    if (user?.status !== "active" && user?.role !== "admin") {
      messageApi.error("You don’t have an active exam package!");
      navigate("/pricing");
      return;
    }

    Modal.confirm({
      title: "Are you sure?",
      content: "Do you really want to start the exam?",
      okText: "Yes, Start",
      cancelText: "Cancel",
      onOk: async () => {
        const data = await startQuizApi(id);
        navigate("/quiz/" + data);
      },
    });
  };

  useEffect(() => {
    setloading(true);
    getCategories()
      .then((data) => {
        setcategories(data.data);
      })
      .finally(() => {
        setloading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-5">
        Welcome back to QuizApp
      </h1>
      {loading ? (
        <div className="w-full h-full flex items-center justify-center min-h-96">
          <Spin size="large" />
        </div>
      ) : (
        <div className="h-full grid lg:grid-cols-4 grid-cols-2 items-center gap-2">
          {categories?.map((item: any, key) => {
            let title = item.title;
            let desc = "";

            // ___ varsa ayırırıq
            if (item.title.includes("___")) {
              const parts = item.title.split("___");
              title = parts[0].trim();
              desc = parts[1].trim();
            }

            return (
              <div
                key={key}
                className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg w-full text-center space-y-6 "
              >
                <h4 className="text-3xl font-bold text-gray-800">{title}</h4>
                {desc && <p className="text-gray-600 text-base italic">{desc}</p>}

                <Button
                  type="primary"
                  size="large"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 text-lg rounded-xl"
                  onClick={() => confirmStartQuiz(item.id)}
                >
                  Start Quiz
                </Button>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}
