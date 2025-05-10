import { MessageSquare, Users, Image, Calendar, FileText, Star } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
  // Icons for the grid with matching colors
  const gridItems = [
    { icon: MessageSquare, color: "bg-primary/20 text-primary" },
    { icon: Users, color: "bg-secondary/20 text-secondary" },
    { icon: Image, color: "bg-accent/20 text-accent" },
    { icon: Calendar, color: "bg-info/20 text-info" },
    { icon: FileText, color: "bg-success/20 text-success" },
    { icon: Star, color: "bg-warning/20 text-warning" },
    { icon: MessageSquare, color: "bg-error/20 text-error" },
    { icon: Users, color: "bg-primary/20 text-primary" },
  ];

  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-base-200 p-12 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-primary/5 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-secondary/5 translate-x-1/4 translate-y-1/4"></div>
      <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-accent/5"></div>
      
      {/* Content container */}
      <div className="max-w-md text-center z-10 backdrop-blur-sm bg-base-100/30 p-8 rounded-3xl shadow-xl">
        {/* Animated grid of icons */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {gridItems.map((item, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl ${item.color} flex items-center justify-center shadow-lg 
              transition-all duration-500 hover:scale-105 hover:shadow-xl 
              ${i % 3 === 0 ? "animate-pulse" : ""}`}
            >
              <item.icon className="size-8" />
            </div>
          ))}
        </div>
        
        {/* Heading with gradient highlight */}
        <h2 className="text-3xl font-bold mb-4 relative inline-block">
          <span className="relative z-10">{title}</span>
          <span className="absolute bottom-0 left-0 w-full h-3 bg-primary/20 rounded-full -z-0"></span>
        </h2>
        
        {/* Subtitle with better spacing */}
        <p className="text-lg text-base-content/70 leading-relaxed">{subtitle}</p>
        
        {/* Additional call to action */}
        <div className="mt-8 flex gap-2 justify-center">
          <div className="badge badge-primary">Secure</div>
          <div className="badge badge-secondary">Fast</div>
          <div className="badge badge-accent">Friendly</div>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;