"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap, Star, Crown, ArrowRight } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  limit: string;
  description: string;
  notes: string;
  features: string[];
  icon: React.ReactNode;
  highlighted?: boolean;
  cta: string;
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: "Free",
    period: "Forever",
    limit: "Up to 5 active listings",
    description: "Get started with property listing",
    notes: "Free or entry-level tier",
    features: [
      "5 active property listings",
      "Basic property information",
      "Contact form on listings",
      "Email support",
    ],
    icon: <Zap className="h-6 w-6" />,
    cta: "Get Started",
  },
  {
    id: "standard",
    name: "Standard",
    price: "$29",
    period: "per month",
    limit: "Up to 25 active listings",
    description: "Boost your visibility with featured slots",
    notes: "Includes featured property slot",
    features: [
      "25 active property listings",
      "Featured property slot",
      "Advanced property details",
      "Analytics dashboard",
      "Priority email support",
      "Custom branding",
    ],
    icon: <Star className="h-6 w-6" />,
    cta: "Upgrade to Standard",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$99",
    period: "per month",
    limit: "Up to 100 active listings",
    description: "Professional tools for serious agents",
    notes: "API integration to MLS, analytics",
    highlighted: true,
    features: [
      "100 active property listings",
      "Unlimited featured slots",
      "MLS API integration",
      "Advanced analytics & reports",
      "Custom website subdomain",
      "Lead scoring",
      "Priority phone support",
      "Monthly strategy call",
    ],
    icon: <Crown className="h-6 w-6" />,
    cta: "Upgrade to Premium",
  },
  {
    id: "enterprise",
    name: "Enterprise / Brokerage",
    price: "Custom",
    period: "Let's talk",
    limit: "Unlimited (with seat-based control)",
    description: "For agencies and broker offices",
    notes: "Used by large agencies or broker offices",
    features: [
      "Unlimited property listings",
      "Seat-based user control",
      "White-label solution",
      "Custom integrations",
      "Dedicated account manager",
      "Advanced team management",
      "Custom training & onboarding",
      "24/7 priority support",
    ],
    icon: <Crown className="h-6 w-6" />,
    cta: "Contact Sales",
  },
];

export default function AgentSubscriptionPlans() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-3">
            Subscription Plans
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan to grow your real estate business. Scale up or down as your needs change.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className="relative group h-full"
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              style={{
                animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Glow Effect for Highlighted Plan */}
              {plan.highlighted && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}

              <Card
                className={`relative h-full transition-all duration-500 ${
                  plan.highlighted
                    ? "border-2 border-blue-500 shadow-2xl transform lg:scale-105"
                    : "border shadow-lg hover:shadow-2xl"
                } ${hoveredPlan === plan.id && !plan.highlighted ? "transform scale-105" : ""}`}
              >
                {/* Badge for Highlighted Plan */}
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full animate-bounce">
                    Most Popular
                  </div>
                )}

                <CardHeader className="pb-4">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 transition-all duration-300 ${
                    plan.highlighted
                      ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                      : "bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                  }`}>
                    {plan.icon}
                  </div>

                  <CardTitle className="text-2xl font-bold text-foreground">
                    {plan.name}
                  </CardTitle>

                  {/* Price */}
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col h-full">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-2">
                    {plan.description}
                  </p>

                  {/* Limit */}
                  <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Listing Limit
                    </p>
                    <p className="text-sm font-bold text-foreground mt-1">
                      {plan.limit}
                    </p>
                  </div>

                  {/* Notes */}
                  <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 font-medium">
                      {plan.notes}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="flex-1 mb-6">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
                      Includes
                    </p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-muted-foreground animate-fadeInUp"
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full transition-all duration-300 group/btn ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* FAQ / Additional Info */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-8 animate-fadeIn">
          <h2 className="text-2xl font-bold text-foreground mb-4">Have questions?</h2>
          <p className="text-muted-foreground mb-6">
            All plans include basic support. Premium and Enterprise plans get priority support. You can upgrade or downgrade your plan at any time with no penalties.
          </p>
          <Button variant="outline" className="gap-2">
            Contact Sales Team
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
}
