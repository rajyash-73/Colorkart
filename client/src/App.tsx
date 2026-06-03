import React, { Suspense, useEffect } from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { PaletteProvider } from "./contexts/PaletteContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { HelmetProvider } from 'react-helmet-async';

import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";

const TestApp = React.lazy(() => import("./TestApp"));
const Home = React.lazy(() => import("@/pages/Home"));
const ClothingPalettePage = React.lazy(() => import("@/pages/ClothingPalettePage"));
const ClothingColorGuide = React.lazy(() => import("@/pages/ClothingColorGuide"));
const VisualizerGuide = React.lazy(() => import("@/pages/VisualizerGuide"));
const ImagePaletteGuide = React.lazy(() => import("@/pages/ImagePaletteGuide"));
const ImagePalette = React.lazy(() => import("@/pages/image-palette"));
const PaletteVisualizer = React.lazy(() => import("@/pages/palette-visualizer"));
const PaletteVisualizerNew = React.lazy(() => import("@/pages/palette-visualizer-new"));
const PrivacyPolicy = React.lazy(() => import("@/pages/privacy-policy"));
const FAQPage = React.lazy(() => import("@/pages/faq"));
const DesignersGuide = React.lazy(() => import("@/pages/designers-guide"));
const GeneratorGuide = React.lazy(() => import("@/pages/GeneratorGuide"));
const AboutPage = React.lazy(() => import("@/pages/about"));
const ContrastChecker = React.lazy(() => import("@/pages/contrast-checker"));
const GradientGenerator = React.lazy(() => import("@/pages/gradient-generator"));
const ColorPicker = React.lazy(() => import("@/pages/color-picker"));
const ExplorePage = React.lazy(() => import("@/pages/explore"));
const FontGenerator = React.lazy(() => import("@/pages/font-generator"));
const AuthPage = React.lazy(() => import("@/pages/auth-page"));
const SavedPalettes = React.lazy(() => import("@/pages/saved-palettes"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 dark:text-gray-300 font-medium">Loading...</p>
    </div>
  </div>
);

const LazyRoute = ({ component: Component, ...props }: any) => (
  <Suspense fallback={<PageLoader />}>
    <Component {...props} />
  </Suspense>
);

const PaletteRoutes = () => (
  <Switch>
    <Route path="/" component={LandingPage} />
    <Route path="/generator"><LazyRoute component={TestApp} /></Route>
    <Route path="/explore"><LazyRoute component={ExplorePage} /></Route>
    <Route path="/font-generator"><LazyRoute component={FontGenerator} /></Route>
    <Route path="/auth"><LazyRoute component={AuthPage} /></Route>
    <Route path="/saved-palettes"><LazyRoute component={SavedPalettes} /></Route>
    <Route path="/korean-color-analysis"><LazyRoute component={ClothingPalettePage} /></Route>
    <Route path="/clothing-palette"><Redirect to="/korean-color-analysis" /></Route>
    <Route path="/image-palette"><LazyRoute component={ImagePalette} /></Route>
    <Route path="/visualize"><LazyRoute component={PaletteVisualizerNew} /></Route>
    <Route path="/visualize-old"><LazyRoute component={PaletteVisualizer} /></Route>
    <Route path="/privacy-policy"><LazyRoute component={PrivacyPolicy} /></Route>
    <Route path="/faq"><LazyRoute component={FAQPage} /></Route>
    <Route path="/designers-guide"><LazyRoute component={DesignersGuide} /></Route>
    <Route path="/generator-guide"><LazyRoute component={GeneratorGuide} /></Route>
    <Route path="/about"><LazyRoute component={AboutPage} /></Route>
    <Route path="/korean-color-analysis-guide"><LazyRoute component={ClothingColorGuide} /></Route>
    <Route path="/clothing-color-guide"><Redirect to="/korean-color-analysis-guide" /></Route>
    <Route path="/visualizer-guide"><LazyRoute component={VisualizerGuide} /></Route>
    <Route path="/image-palette-guide"><LazyRoute component={ImagePaletteGuide} /></Route>
    <Route path="/contrast-checker"><LazyRoute component={ContrastChecker} /></Route>
    <Route path="/gradient-generator"><LazyRoute component={GradientGenerator} /></Route>
    <Route path="/color-picker"><LazyRoute component={ColorPicker} /></Route>
    <Route component={NotFound} />
  </Switch>
);

function App() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" &&
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <PaletteProvider>
              <PaletteRoutes />
              <Toaster />
            </PaletteProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
