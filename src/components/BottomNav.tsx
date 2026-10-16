import { Home, PhoneCall } from 'lucide-react';

export type PublicTab = 'jansunwai' | 'directory' | 'initiative';

interface BottomNavProps {
  currentTab: PublicTab;
  onTabChange: (tab: PublicTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    {
      id: 'jansunwai' as PublicTab,
      label: 'जनसुनवाई',
      sublabel: 'Home',
      icon: Home,
    },
    {
      id: 'directory' as PublicTab,
      label: 'थाने व संपर्क',
      sublabel: 'Directory',
      icon: PhoneCall,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.07)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="मुख्य नेविगेशन"
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 relative transition-all duration-200 active:scale-95 rounded-xl ${
                isActive
                  ? 'text-blue-950 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Indicator Top Pill */}
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-sm" />
              )}

              {/* Icon with glow background when active */}
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-900 scale-105 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>

              {/* Label */}
              <span className="text-[11px] font-devanagari tracking-tight mt-0.5 leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
