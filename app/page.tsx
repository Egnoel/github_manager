'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Github,
  ArrowRight,
  Code,
  TrendingUp,
  Target,
  BarChart3,
  Zap,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';

const HomePage = () => {
  const { login } = useGitHubAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle code from Supabase OAuth callback
    const code = searchParams.get('code');
    if (code) {
      // Redirect to callback handler
      window.location.href = `/auth/callback?code=${code}&next=/dashboard`;
    }
  }, [searchParams]);

  const handleGitHubLogin = async () => {
    await login();
  };

  const features = [
    {
      icon: Code,
      title: 'Repository Management',
      description:
        'Centralize all your repositories in one place. Track stars, forks, and activity across all your projects.',
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description:
        'Get insights into your coding activity with detailed analytics, commit streaks, and productivity metrics.',
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description:
        'Set and track personal goals. Monitor your progress and stay motivated with milestone achievements.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Metrics',
      description:
        'Deep dive into your GitHub activity with heatmaps, contribution graphs, and language statistics.',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description:
        'Stay on top of your activity with real-time notifications and updates from your repositories.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description:
        'Your data is secure. We use GitHub OAuth for authentication and never store your credentials.',
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Github className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">GitTracker</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="#features"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#about"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </div>
              <Button
                onClick={handleGitHubLogin}
                className="inline-flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                Login with GitHub
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Manage Your GitHub Activity
              <span className="text-primary"> Like Never Before</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Centralize your repositories, track performance, and stay on top
              of your goals with a single, focused dashboard. Get insights into
              your coding journey and boost your productivity.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button
                onClick={handleGitHubLogin}
                size="lg"
                className="inline-flex items-center gap-2 text-base"
              >
                <Github className="h-5 w-5" />
                Sign in with GitHub
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Track Your Progress
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features to help you understand and improve your GitHub
              activity.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join developers who are already tracking their progress and
              achieving their goals.
            </p>
            <div className="mt-10">
              <Button
                onClick={handleGitHubLogin}
                size="lg"
                className="inline-flex items-center gap-2 text-base"
              >
                <Github className="h-5 w-5" />
                Sign in with GitHub
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Github className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">GitTracker</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Your comprehensive GitHub activity dashboard. Track
                repositories, monitor performance, and achieve your coding
                goals.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-center text-muted-foreground">
              © {new Date().getFullYear()} GitTracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
