import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Strategies from "./pages/Strategies";
import StrategyForm from "./pages/StrategyForm";
import MonthlyPlans from "./pages/MonthlyPlans";
import MonthlyPlanForm from "./pages/MonthlyPlanForm";
import Content from "./pages/Content";
import ContentForm from "./pages/ContentForm";
import ContentDetail from "./pages/ContentDetail";
import Files from "./pages/Files";

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Login />}
      </Route>
      
      <Route path="/">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
      </Route>
      
      <Route path="/dashboard">
        {isAuthenticated ? <Dashboard /> : <Redirect to="/login" />}
      </Route>
      
      <Route path="/strategies">
        {isAuthenticated ? <Strategies /> : <Redirect to="/login" />}
      </Route>
      
      <Route path="/strategies/new">
        {isAuthenticated ? <StrategyForm /> : <Redirect to="/login" />}
      </Route>
      
      <Route path="/strategies/:id">
        {isAuthenticated ? <StrategyForm /> : <Redirect to="/login" />}
      </Route>
      
      <Route path="/monthly-plans">
        {isAuthenticated ? <MonthlyPlans /> : <Redirect to="/login" />}
      </Route>
      
      <Route path="/monthly-plans/new">
        {isAuthenticated ? <MonthlyPlanForm /> : <Redirect to="/login" />}
      </Route>
      
      <Route path="/monthly-plans/:id">
        {isAuthenticated ? <MonthlyPlanForm /> : <Redirect to="/login" />}
      </Route>
      
      <Route path="/content">
        {isAuthenticated ? <Content /> : <Redirect to="/login" />}
      </Route>
      
      <Route path="/content/new">
        {isAuthenticated ? <ContentForm /> : <Redirect to="/login" />}
      </Route>
      
      <Route path="/content/:id/edit">
        {isAuthenticated ? <ContentForm /> : <Redirect to="/login" />}
      </Route>
      
      <Route path="/content/:id">
        {isAuthenticated ? <ContentDetail /> : <Redirect to="/login" />}
      </Route>
      
      <Route path="/files">
        {isAuthenticated ? <Files /> : <Redirect to="/login" />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
