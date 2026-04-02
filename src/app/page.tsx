import { 
  Plus, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-2 italic">Welcome back, vinhung</h1>
        <p className="text-muted-notion italic">
          Here is what is happening with your career roadmap today.
        </p>
      </section>

      {/* Quick Stats / Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Skills Extracted', value: '12', icon: CheckCircle2, color: 'text-green-600' },
          { label: 'Roadmap Progress', value: '45%', icon: Clock, color: 'text-blue-600' },
          { label: 'Job Matches', value: '08', icon: AlertCircle, color: 'text-orange-600' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-lg border border-border-notion bg-white dark:bg-zinc-900/50 hover:shadow-sm transition-shadow group cursor-default">
            <div className="flex items-center justify-between mb-2 italic">
              <stat.icon size={18} className={`${stat.color} italic`} />
              <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-muted-notion transition-colors italic" />
            </div>
            <p className="text-2xl font-bold italic">{stat.value}</p>
            <p className="text-xs text-muted-notion font-medium uppercase tracking-wider italic">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Actions Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold italic">Recent Activities</h2>
          <button className="text-sm text-accent-notion hover:underline font-medium italic">View all</button>
        </div>
        
        <div className="rounded-xl border border-border-notion divide-y divide-border-notion overflow-hidden bg-white dark:bg-zinc-900/50">
          {[
            { title: 'CV_Software_Engineer_Intern.pdf', date: '2 hours ago', status: 'Parsed', type: 'CV' },
            { title: 'Backend Developer Roadmap', date: 'Yesterday', status: 'Generating', type: 'Roadmap' },
            { title: 'Fullstack React Developer', date: 'Mar 28, 2024', status: 'Completed', type: 'Roadmap' },
          ].map((activity, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group italic">
              <div className="flex items-center gap-3 italic">
                <div className="w-10 h-10 rounded-lg border border-border-notion bg-gray-50 dark:bg-zinc-800 flex items-center justify-center italic">
                  <span className="text-[10px] font-bold text-muted-notion italic">{activity.type}</span>
                </div>
                <div>
                  <p className="text-sm font-medium group-hover:text-accent-notion transition-colors italic">{activity.title}</p>
                  <p className="text-xs text-muted-notion italic">{activity.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 italic">
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-medium italic",
                  activity.status === 'Completed' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 italic" : 
                  activity.status === 'Generating' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 italic" :
                  "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 italic"
                )}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Empty State / CTA */}
      <section className="p-8 rounded-2xl border-2 border-dashed border-border-notion flex flex-col items-center justify-center text-center space-y-4 bg-gray-50/50 dark:bg-zinc-900/20">
        <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 border border-border-notion flex items-center justify-center shadow-sm italic">
          <Plus size={24} className="text-muted-notion italic" />
        </div>
        <div className="max-w-xs italic">
          <h3 className="font-semibold italic">Start a new analysis</h3>
          <p className="text-sm text-muted-notion italic">Upload your CV to generate a personalized career roadmap powered by AI.</p>
        </div>
        <button className="bg-accent-notion hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all italic">
          Upload CV
        </button>
      </section>
    </div>
  );
}

// Simple helper for conditional classes since we are in the same file for now
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

