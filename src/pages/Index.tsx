
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 md:text-5xl">Dev Pulse Network</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with developers, share knowledge, and grow your professional network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Connect</CardTitle>
              <CardDescription>Build your professional network</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Connect with like-minded developers and industry professionals to expand your network.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share</CardTitle>
              <CardDescription>Share your knowledge</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Share your experiences, projects, and technical insights with the community.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grow</CardTitle>
              <CardDescription>Accelerate your career</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Learn from others, discover opportunities, and take your career to the next level.</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="font-semibold">
            <Link to="/feed">
              Explore Feed
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-semibold">
            <Link to="/profile">
              My Profile
            </Link>
          </Button>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2025 Dev Pulse Network. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
