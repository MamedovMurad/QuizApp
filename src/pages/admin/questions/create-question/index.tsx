import { Spin } from "antd";
import { Link, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { getCategories } from "../../../../api/quiz";
import { QuestionForm } from "../../_components/QuestionForm";


export default function CreateQuestion() {
  const [categories, setcategories] = useState([]);
  const [loading, setloading] = useState(false);




  useEffect(() => {
    setloading(true)
    getCategories().then((data) => {
      setcategories(data.data)
    }).finally(() => {
      setloading(false)
    })
  }, []);

  console.log(categories, "categories");

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-5">Welcome to back QuizApp</h1>
      {
        loading ? <div className=" w-full h-full flex items-center justify-center min-h-96">
          <Spin size="large" />
        </div> : <div className=" h-full  grid lg:grid-cols-4 grid-cols-2 items-center gap-2">
          {
            categories?.map(((item: any, key) => (
              <div key={key} className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg w-full text-center space-y-6">
                <h4 className="text-3xl font-bold text-gray-800">{item.title}</h4>


                <Link
                  to={"" + item.id}

                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 text-lg rounded-xl"

                >
                  Choose
                </Link>
              </div>
            )))

          }
        </div>
      }

    </div>
  );
}



export function StoreQuestion() {
  const { id } = useParams()
  return (
    <QuestionForm id={id} />
  )
}
