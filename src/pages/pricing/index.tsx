import { useEffect, useState, type FunctionComponent } from "react";
import { getPricings, makePayment } from "../../api/pricing";
import { message, Spin, Input, Modal, Checkbox } from "antd";

interface Pricing {
  id: number;
  title: string;
  description: string;
  price: number;
  count: number;
  category_id?: string;
}

interface PricingPageProps { }

const PricingPage: FunctionComponent<PricingPageProps> = () => {
  const [data, setData] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [promoCodes, setPromoCodes] = useState<Record<number, string>>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [termsVisible, setTermsVisible] = useState<boolean>(false);
  const [accepted, setAccepted] = useState<boolean>(false);

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

  function confirmPayment(id: number) {
    setSelectedId(id);
    setAccepted(false); // hər dəfə sıfırlansın
    setTermsVisible(true);
  }

  function handleMakePayment() {
    if (!selectedId) return;
    const code = promoCodes[selectedId] || "";

    message.loading({ content: "Loading...", key: "loading" });

    makePayment(selectedId, code)
      .then((data) => {
        message.destroy("loading");
        setTermsVisible(false);

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
            <div className="flex justify-end">
                  {item.category_id && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {item.category_id}
                  </span>
                )}
            </div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
            
              </div>
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
                className="rounded-xl"
              />
            </div>

            <div>
              <p className="text-2xl font-bold text-blue-600 mt-4">
                ${item.price}
              </p>
              <button
                onClick={() => confirmPayment(item.id)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Terms Modal */}
      <Modal
        title="Terms of Use"
        open={termsVisible}
        onCancel={() => setTermsVisible(false)}
        footer={null}
      >
        <div className="max-h-60 overflow-y-auto mb-4 text-gray-700 space-y-3">
          <p>
            <strong>No Legal Claims</strong> <br />
            Users cannot make any legal claims or take legal action against the
            website owner regarding the use of the website, its content, or any
            technical issues.
          </p>
          <p>
            For technical problems, users must contact{" "}
            <a
              href="mailto:info@dataexamhub.com"
              className="text-blue-600 underline"
            >
              info@dataexamhub.com
            </a>
            . A response will be provided within 14 days.
          </p>
          <p>
            <strong>No Refunds</strong> <br />
            All payments are final and non-refundable.
          </p>
          <p>
            <strong>No Sharing of Content</strong> <br />
            Exam questions and other materials provided on this website must not
            be shared, copied, or distributed on external websites, social
            media, or in training materials.
          </p>
        </div>

        <Checkbox
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        >
          I accept the Terms of Use
        </Checkbox>

        <div className="mt-4 flex justify-end">
          <button
            disabled={!accepted}
            onClick={handleMakePayment}
            className={`px-4 py-2 rounded-xl text-white ${accepted
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Continue to Payment
          </button>
        </div>
      </Modal>
    </main>
  );
};

export default PricingPage;
