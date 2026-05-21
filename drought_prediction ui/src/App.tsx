import React, { useState, useEffect } from "react";
import {
  CloudSun,
  LayoutDashboard,
  Home,
  History,
  AlertTriangle,
  Droplets,
  Thermometer,
  Wind,
  Sprout,
  ArrowRight,
  Menu,
  X,
  Github,
  Sun,
  Moon,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster, toast } from "sonner";
import {
  runPrediction,
  fetchHistory,
  type PredictionInput,
  type PredictionResult,
} from "@/lib/prediction-engine";
import LearnPage from "./components/LearnPage";

// --- Components ---

const Navbar = ({
  onNavigate,
  currentPage,
}: {
  onNavigate: (page: string) => void;
  currentPage: string;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate("landing")}
          >
            <div className="bg-primary/10 p-2 rounded-lg">
              <CloudSun className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              DroughtGuard AI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigate("landing")}
              className={`text-sm font-medium transition-colors hover:text-primary ${currentPage === "landing" ? "text-primary" : "text-muted-foreground"}`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("learn")}
              className={`text-sm font-medium transition-colors hover:text-primary ${currentPage === "learn" ? "text-primary" : "text-muted-foreground"}`}
            >
              Learn More
            </button>
            <button
              onClick={() => onNavigate("dashboard")}
              className={`text-sm font-medium transition-colors hover:text-primary ${currentPage === "dashboard" ? "text-primary" : "text-muted-foreground"}`}
            >
              Dashboard
            </button>
            <Button size="sm" onClick={() => onNavigate("dashboard")}>
              Start Prediction
            </Button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-background border-b absolute w-full"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <button
                onClick={() => {
                  onNavigate("landing");
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground"
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigate("learn");
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground"
              >
                Learn More
              </button>
              <button
                onClick={() => {
                  onNavigate("dashboard");
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground"
              >
                Dashboard
              </button>
              <div className="px-3 pt-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    onNavigate("dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Start Prediction
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LandingPage = ({
  onStart,
  onLearn,
}: {
  onStart: () => void;
  onLearn: () => void;
}) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10">
          <img
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/fc5c3f9a-ef62-45c8-ae41-c7a4379ca7bc/hero-background-07c45be7-1779271608996.webp"
            alt="Farm background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="outline"
                className="mb-4 py-1 px-4 text-primary border-primary/20 bg-primary/5"
              >
                Powered by Advanced ML
              </Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                AI-Based{" "}
                <span className="text-primary">Drought Prediction</span> System
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Empowering farmers and researchers with precision climate
                analytics to mitigate drought risks and optimize agricultural
                yield using local environmental data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="h-12 px-8 text-lg"
                  onClick={onStart}
                >
                  Start Prediction Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-lg"
                  onClick={onLearn}
                >
                  Learn How It Works
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
            <p className="text-muted-foreground">
              Comprehensive monitoring for proactive climate adaptation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Thermometer className="w-10 h-10 text-orange-500" />,
                title: "Precision Analytics",
                description:
                  "Utilize real-time temperature and soil moisture data for highly accurate local predictions.",
              },
              {
                icon: <Droplets className="w-10 h-10 text-blue-500" />,
                title: "Water Management",
                description:
                  "Get personalized irrigation recommendations based on predicted drought severity levels.",
              },
              {
                icon: <Sprout className="w-10 h-10 text-green-500" />,
                title: "Crop Resilience",
                description:
                  "Protect your agricultural investment by anticipating water stress before it impacts your yield.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-8 bg-background rounded-2xl border shadow-sm"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [formData, setFormData] = useState<PredictionInput>({
    temperature: 25,
    rainfall: 150,
    humidity: 60,
    soil_moisture: 45,
    wind_speed: 12,
    vegetation_index: 0.7,
    evapotranspiration: 3.5,
    region: "Central Plains",
  });

  useEffect(() => {
    const loadHistory = async () => {
      const data = await fetchHistory();
      if (data && data.length > 0) {
        setHistory(data);
      } else {
        const saved = localStorage.getItem("drought_history");
        if (saved) setHistory(JSON.parse(saved));
      }
    };
    loadHistory();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "region" ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await runPrediction(formData);
      setResult(res);
      const newHistory = [res, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem("drought_history", JSON.stringify(newHistory));
      toast.success("Prediction completed successfully!");
    } catch (error) {
      toast.error("An error occurred during prediction.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData({
      temperature: 25,
      rainfall: 150,
      humidity: 60,
      soil_moisture: 45,
      wind_speed: 12,
      vegetation_index: 0.7,
      evapotranspiration: 3.5,
      region: "Central Plains",
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Severe":
        return "text-red-500 bg-red-50 border-red-200 dark:bg-red-900/20";
      case "Moderate":
        return "text-orange-500 bg-orange-50 border-orange-200 dark:bg-orange-900/20";
      case "Low":
        return "text-green-500 bg-green-50 border-green-200 dark:bg-green-900/20";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-5">
          <Card className="shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-primary" />
                Input Parameters
              </CardTitle>
              <CardDescription>
                Provide the latest environmental metrics for accurate modeling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (\u00b0C)</Label>
                    <Input
                      id="temperature"
                      name="temperature"
                      type="number"
                      step="0.1"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rainfall">Rainfall (mm)</Label>
                    <Input
                      id="rainfall"
                      name="rainfall"
                      type="number"
                      step="1"
                      value={formData.rainfall}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="humidity">Humidity (%)</Label>
                    <Input
                      id="humidity"
                      name="humidity"
                      type="number"
                      step="1"
                      max="100"
                      value={formData.humidity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soil_moisture">Soil Moisture (%)</Label>
                    <Input
                      id="soil_moisture"
                      name="soil_moisture"
                      type="number"
                      step="1"
                      max="100"
                      value={formData.soil_moisture}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wind_speed">Wind Speed (km/h)</Label>
                    <Input
                      id="wind_speed"
                      name="wind_speed"
                      type="number"
                      step="0.1"
                      value={formData.wind_speed}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evapotranspiration">
                      Evapotransp. (mm)
                    </Label>
                    <Input
                      id="evapotranspiration"
                      name="evapotranspiration"
                      type="number"
                      step="0.1"
                      value={formData.evapotranspiration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="vegetation_index">
                      Vegetation Index (NDVI 0-1)
                    </Label>
                    <Input
                      id="vegetation_index"
                      name="vegetation_index"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={formData.vegetation_index}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="region">Region / Location</Label>
                    <Input
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      placeholder="e.g. Sahara Region, Nile Delta"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      "Run AI Prediction"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results & History */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 bg-muted/20 rounded-2xl border-2 border-dashed"
              >
                <div className="bg-muted p-4 rounded-full mb-4">
                  <LayoutDashboard className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Ready for Prediction</h3>
                <p className="text-muted-foreground text-center mt-2 max-w-sm">
                  Fill in the environmental data on the left to see the AI
                  analysis and drought risk levels.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <Card className="overflow-hidden border-2 border-primary/20">
                  <div
                    className={`h-2 w-full ${result.prediction === "Drought Likely" ? "bg-red-500" : "bg-green-500"}`}
                  />
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-3xl font-bold">
                          {result.prediction}
                        </CardTitle>
                        <CardDescription>
                          Analysis for {formData.region}
                        </CardDescription>
                      </div>
                      <Badge
                        className={`px-4 py-1 text-sm ${getRiskColor(result.risk_level)}`}
                      >
                        {result.risk_level} Risk
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Confidence Score</span>
                        <span>{result.confidence}%</span>
                      </div>
                      <Progress value={result.confidence} className="h-3" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-xl border">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          Key Findings
                        </h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          {formData.rainfall < 50 && (
                            <li>\u2022 Critically low rainfall detected</li>
                          )}
                          {formData.soil_moisture < 20 && (
                            <li>\u2022 Severe soil moisture deficit</li>
                          )}
                          {formData.temperature > 35 && (
                            <li>\u2022 Extreme temperature stress</li>
                          )}
                          {formData.vegetation_index < 0.4 && (
                            <li>\u2022 Vegetation health showing stress</li>
                          )}
                          {formData.rainfall >= 50 &&
                            formData.soil_moisture >= 20 && (
                              <li>\u2022 Environmental parameters stable</li>
                            )}
                        </ul>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-xl border">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Sprout className="w-4 h-4 text-green-500" />
                          Recommendations
                        </h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          {result.risk_level === "Severe" ? (
                            <>
                              <li>\u2022 Emergency water conservation</li>
                              <li>\u2022 Implement crop shading</li>
                              <li>\u2022 Priority irrigation queue</li>
                            </>
                          ) : result.risk_level === "Moderate" ? (
                            <>
                              <li>\u2022 Monitor soil moisture daily</li>
                              <li>\u2022 Optimize irrigation schedule</li>
                              <li>\u2022 Mulch soil to prevent loss</li>
                            </>
                          ) : (
                            <>
                              <li>\u2022 Standard agricultural practices</li>
                              <li>\u2022 Efficient water usage</li>
                              <li>\u2022 Routine weather monitoring</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <History className="w-5 h-5" />
                      Recent History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Prediction</TableHead>
                          <TableHead>Risk</TableHead>
                          <TableHead className="text-right">
                            Confidence
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.prediction}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getRiskColor(item.risk_level)}
                              >
                                {item.risk_level}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {item.confidence}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState<"landing" | "dashboard" | "learn">(
    "landing",
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar onNavigate={(p) => setPage(p as any)} currentPage={page} />

      <main>
        <AnimatePresence mode="wait">
          {page === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LandingPage
                onStart={() => setPage("dashboard")}
                onLearn={() => setPage("learn")}
              />
            </motion.div>
          )}
          {page === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Dashboard />
            </motion.div>
          )}
          {page === "learn" && (
            <motion.div
              key="learn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LearnPage onStart={() => setPage("dashboard")} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-muted/50 border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-primary" />
              <span className="font-bold">DroughtGuard AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              \u00a9 2024 DroughtGuard AI. All rights reserved. Precision
              Climate Intelligence.
            </p>
            <div className="flex items-center gap-6">
              <Github className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
              <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary">
                Documentation
              </span>
              <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary">
                API
              </span>
            </div>
          </div>
        </div>
      </footer>

      <Toaster position="top-right" richColors />
    </div>
  );
}
