import { useEffect, useState, type FunctionComponent } from "react";
import { getPricings, makePayment } from "../../api/pricing";
import { message, Spin } from "antd";

interface Pricing {
  id: number;
  title: string;
  description: string;
  price: number;
  count: number;
}

interface PricingPageProps { }

const PricingPage: FunctionComponent<PricingPageProps> = () => {
  const [data, setData] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getPricings()
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        // İstəyə bağlı olaraq, xətanı handle etmək olar
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


function handleMakePayment(id: string | number) {
  message.loading({ content: 'Loading...', key: 'loading' });
  makePayment(id).then((data) => {
    message.destroy('loading'); // loading mesajını silirik

    if (data?.data?.payment_url) {
      window.location.href = data.data?.payment_url;  // burda yönləndirmə olur
    } else {
      message.error('Ödəniş URL-si tapılmadı.');
    }
  }).catch(() => {
    message.destroy('loading');
    message.error('Ödəniş yaradılarkən xəta baş verdi.');
  });
}

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <main className="py-4 px-4 md:px-8 lg:px-16">
      <h1 className="text-3xl font-bold text-center mb-8">Pricing Plans</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {item.title}
              </h2>
              <p className="text-gray-500 mb-3">{item.description}</p>
              <p className="text-sm text-gray-600 italic">
                {item.count} exam attempt{item.count > 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600 mt-4">
                ${item.price}
              </p>
              <button onClick={() => handleMakePayment(item.id)} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default PricingPage;
