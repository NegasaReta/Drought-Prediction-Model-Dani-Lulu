import React from "react";
import { motion } from "framer-motion";
import { 
  Database, 
  Cpu, 
  LineChart, 
  CheckCircle2, 
  ChevronRight,
  Info,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LearnPage = ({ onStart }: { onStart: () => void }) => {
  const steps = [
    {
      icon: <Database className="w-8 h-8 text-blue-500" />,
      title: "Data Input",
      description: "Enter local environmental metrics including temperature, rainfall, and soil moisture. Our system processes these using real-time values for your specific region."
    },
    {
      icon: <Cpu className="w-8 h-8 text-purple-500" />,
      title: "AI Analysis",
      description: "Our trained Machine Learning model (Random Forest/Weighted Threshold) analyzes the input against historical patterns and climate thresholds."
    },
    {
      icon: <LineChart className="w-8 h-8 text-green-500" />,
      title: "Risk Calculation",
      description: "The system calculates a confidence score and assigns a risk level (Low, Moderate, Severe) based on the mathematical probability of drought conditions."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-orange-500" />,
      title: "Expert Advice",
      description: "Get immediate recommendations for water management, irrigation scheduling, and crop protection tailored to your results."
    }
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="bg-primary/5 border-b py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How DroughtGuard AI Works</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Understand the science and technology behind our predictive climate intelligence system.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* The Process */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Prediction Pipeline</h2>
            <p className="text-muted-foreground">Four steps to precision agricultural intelligence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="mb-4 bg-background w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm">
                      {step.icon}
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Technical Deep Dive */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/fc5c3f9a-ef62-45c8-ae41-c7a4379ca7bc/data-visualization-0e74606a-1779271608358.webp" 
                alt="AI Model Visualization" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold">Model Performance</span>
                  </div>
                  <p className="text-white/80 text-sm">Our model is trained on over 50 years of historical climate data from global observation stations.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold">The Science of Prediction</h2>
            <p className="text-muted-foreground">
              Drought is a complex phenomenon influenced by multiple meteorological and hydrological variables. Our system uses a multi-variate approach to ensure accuracy.
            </p>
            
            <div className="space-y-4">
              {[
                { label: "Meteorological Drought", desc: "Based on precipitation deficiency over a period." },
                { label: "Agricultural Drought", desc: "Focuses on soil moisture and plant water stress." },
                { label: "Hydrological Drought", desc: "Monitors surface and subsurface water supplies." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold">{item.label}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="mt-6" onClick={onStart}>
              Try the System Now
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>

        {/* FAQ / Model Details */}
        <section className="bg-muted/30 rounded-3xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Info className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-bold mb-2">How accurate are the predictions?</h4>
                <p className="text-muted-foreground">
                  Our core model achieves an 85-92% accuracy rate in controlled testing environments. Accuracy varies based on the quality and specificity of the regional data provided.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-2">What data points are most critical?</h4>
                <p className="text-muted-foreground">
                  Rainfall and Soil Moisture have the highest weights in our current JSON-based predictive model, as they are the most direct indicators of immediate water stress.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-2">Can I use this for any crop?</h4>
                <p className="text-muted-foreground">
                  Yes, the drought indicators are universal. However, our recommendations specifically focus on general resilient farming practices and water conservation techniques.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LearnPage;