import { useEffect, useState, type FunctionComponent } from "react";
import { getPricings, makePayment } from "../../api/pricing";
import { message, Spin, Input } from "antd";

interface Pricing {
  id: number;
  title: string;
  description: string;
  price: number;
  count: number;
}

interface PricingPageProps {}

const PricingPage: FunctionComponent<PricingPageProps> = () => {
  const [data, setData] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [promoCodes, setPromoCodes] = useState<Record<number, string>>({});

  useEffect(() => {
    setLoading(true);
    getPricings()
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        message.error("Qiymət planları yüklənərkən xəta baş verdi.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleMakePayment(id: number) {
    const code = promoCodes[id] || "";

    message.loading({ content: "Loading...", key: "loading" });

    makePayment(id,  code ) // hər kartın promo kodu ayrıca göndərilir
      .then((data) => {
        message.destroy("loading");

        if (data?.data?.payment_url) {
          window.location.href = data.data.payment_url;
        } else {
          message.error("Ödəniş URL-si tapılmadı.");
        }
      })
      .catch(() => {
        message.destroy("loading");
        message.error("Ödəniş yaradılarkən xəta baş verdi.");
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

      {/* Pricing grid */}
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
              <p className="text-sm text-gray-600 italic mb-3">
                {item.count} exam attempt{item.count > 1 ? "s" : ""}
              </p>

              {/* Promo code input hər kartda */}
              <Input
                placeholder="Enter promo code"
                value={promoCodes[item.id] || ""}
                onChange={(e) =>
                  setPromoCodes((prev) => ({
                    ...prev,
                    [item.id]: e.target.value,
                  }))
                }
                className=" rounded-xl"
              />
            </div>

            <div>
              <p className="text-2xl font-bold text-blue-600 mt-4">
                ${item.price}
              </p>
              <button
                onClick={() => handleMakePayment(item.id)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
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
