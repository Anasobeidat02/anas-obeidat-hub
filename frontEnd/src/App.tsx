
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Videos from "./pages/Videos";
import VideoDetail from "./pages/VideoDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminLanguages from "./pages/admin/AdminLanguages";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminArticles from "./pages/admin/AdminArticles";
import RequireAuth from "./components/admin/RequireAuth";
import Quiz from "./pages/Quiz";
import ProgrammingLanguages from "./pages/ProgrammingLanguages";
import ArticleDetail from "./pages/ArticleDetail";
import LanguageDetail from "./pages/LanguageDetail";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/videos/:id" element={<VideoDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/programming-languages" element={<ProgrammingLanguages />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/languages/:slug" element={<LanguageDetail />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/admin-login-0382" element={<AdminLogin />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<RequireAuth />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="questions" element={<AdminQuestions />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="languages" element={<AdminLanguages />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
