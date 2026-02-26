import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { HERO_IMAGES } from "@shared/assets";
import { ArrowRight, CheckCircle2, Users, Calendar, FileText, BarChart3 } from "lucide-react";

export default function Login() {
  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Image & Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.9), rgba(30, 58, 138, 0.85)), url(${HERO_IMAGES.collaboration})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4">Client Portal</h1>
            <p className="text-xl text-blue-100">
              Streamline your marketing collaboration with powerful tools for strategy, content planning, and team coordination.
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Strategic Planning</h3>
                <p className="text-blue-100 text-sm">
                  Collaborate on monthly strategies with configurable frameworks and approval workflows
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Content Workflow</h3>
                <p className="text-blue-100 text-sm">
                  4-stage content creation from topics to published posts with multi-view calendar
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Team Collaboration</h3>
                <p className="text-blue-100 text-sm">
                  Role-based access control with granular permissions for agency and client teams
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Progress Tracking</h3>
                <p className="text-blue-100 text-sm">
                  Real-time dashboards showing scope completion, activity feed, and team performance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md border-2">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Welcome Back</CardTitle>
            <CardDescription className="text-base">
              Sign in to access your client portal and collaborate with your team
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Button 
              onClick={handleLogin}
              size="lg"
              className="w-full text-lg h-14 bg-primary hover:bg-primary/90"
            >
              Sign in with Google
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center mb-4">
                What you'll get access to:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Strategy planning and approval workflows</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Content calendar with Kanban, Calendar, and List views</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>File library with cloud storage integration</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Ticketing system with SLA tracking</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground pt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
