import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createUserOrder,
  resetPayment,
  verifyUserPayment,
} from "../redux/reducers/paymentReducer";
import toast from "react-hot-toast";

const PricingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedPlan, setSelectedPlan] = useState("free");

  const { loading, success, error } = useSelector(
    (state) => state.paymentReducer,
  );

  useEffect(() => {
    if (success) {
      toast.success("Payment Successful 🎉 Credits Added!");
      dispatch(resetPayment());
      navigate("/");
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error("Payment failed");
      dispatch(resetPayment());
    }
  }, [error, dispatch]);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparaion.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advance AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];

  const handlePayment = async (plan) => {
    try {
      const amount = plan.id === "basic" ? 100 : plan.id === "pro" ? 500 : 0;

      const order = await dispatch(
        createUserOrder({
          planId: plan.id,
          amount,
          credits: plan.credits,
        }),
      ).unwrap();

      // if order creation failed, stop here — error is already in store
      if (createUserOrder.rejected.match(order)) return;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_TEST_API_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Intervuedot.AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: order.id,

        handler: async function (res) {
          try {
            await dispatch(verifyUserPayment(res)).unwrap();
          } catch (error) {
            console.error(`Payment verification error: ${error}`);
          }
        },
        theme: {
          color: "#b53026",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Unable to initiate payment. Please try again.");
      console.error(`payment order not initiate: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-red-50 py-16 px-6">
      <div className="max-w-6xl mx-auto mb-14 flex items-start gap-4">
        <button
          onClick={() => navigate("/")}
          className="mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>

        <div className="text-center w-full">
          <h1 className="text-4xl font-bold text-gray-800">Choose Your Plan</h1>
          <p className="text-gray-500 mt-3 text-lg">
            Flexible pricing to match your interview preparation goals.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <motion.div
              key={plan.id}
              whileHover={!plan.default && { scale: 1.03 }}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`relative rounded-3xl p-8 transition-all duration-300 border ${isSelected ? "border-red-600 shadow-2xl bg-white" : "border-gray-200 bg-white shadow-md"} ${plan.default ? "cursor-default" : "cursor-pointer"}`}
            >
              {/* BADGE */}
              {plan.badge && (
                <div className="absolute top-6 right-6 bg-red-600 text-white text-xs px-4 py-1 rounded-full shadow">
                  {plan.badge}
                </div>
              )}

              {/* DEFAULT TAG */}
              {plan.default && (
                <div className="absolute top-6 right-6 text-gray-700 bg-gray-200 text-xs px-3 py-1 rounded-full">
                  Default
                </div>
              )}

              {/* PLAN NAME */}
              <h1 className="text-xl font-semibold text-gray-800">
                {plan.name}
              </h1>

              {/* PRICE */}
              <div className="mt-4">
                <span className="text-3xl font-bold text-red-600">
                  {plan.price}
                </span>
                <p className="text-gray-500 mt-1">{plan.credits} Credits</p>
              </div>

              {/* DESCRIPTION */}
              <p className="text-gray-500 mt-4 text-sm leading-relaxed">
                {plan.description}
              </p>

              {/* FEATURES */}
              <div className="mt-6 space-y-3 text-left">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <FaCheckCircle className="text-red-600 text-sm" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {!plan.default && (
                <button
                  disabled={loading}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSelected) setSelectedPlan(plan.id);
                    else handlePayment(plan);
                  }}
                  className={`w-full mt-8 py-3 rounded-xl font-semibold transition ${isSelected ? "bg-red-600 text-white hover:opacity-90" : "bg-gray-100 text-gray-700 hover:bg-red-50"}`}
                >
                  {loading && isSelected
                    ? "Processing..."
                    : isSelected
                      ? "Proceed to Pay"
                      : "Select Plan"}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingPage;
