'use client';

import React, { memo } from 'react';
import { usePayment } from '@/hooks/usePayment';

const PricingSection = memo(function PricingSection() {
  const { plans, purchasePlan, isProcessingPlan } = usePayment();

  return (
    <section className="mb-12 lg:mb-16">
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Choose Your Plan
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl p-6 border-2 h-fit ${
                plan.popular
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-600 relative'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {plan.price}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {plan.description}
              </p>

              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.id !== 'free' && (
                <div className="mt-4">
                  <button
                    onClick={() => purchasePlan(plan.id)}
                    disabled={isProcessingPlan(plan.id)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                      plan.id === 'pro'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isProcessingPlan(plan.id)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-lg hover:shadow-xl'
                        : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {plan.id === 'pro'
                      ? 'Coming Soon'
                      : isProcessingPlan(plan.id)
                      ? 'Processing...'
                      : `Get ${plan.name}`}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default PricingSection;