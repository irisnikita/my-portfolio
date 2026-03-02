import { useState, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';

interface Props {
  username: string;
}

export default function GitHubGraph({ username }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-[150px] w-full animate-pulse bg-white/5 rounded-md">
        <span className="text-white/30 text-xs uppercase tracking-widest">Loading Graph...</span>
      </div>
    );
  }

  // Cyan theme mapped to varying opacities
  const explicitTheme = {
    light: ['#1e1e2e', '#00e5ff33', '#00e5ff66', '#00e5ff99', '#00e5ff'],
    dark: ['rgba(255,255,255,0.03)', 'rgba(0, 229, 255, 0.2)', 'rgba(0, 229, 255, 0.5)', 'rgba(0, 229, 255, 0.8)', 'rgba(0, 229, 255, 1)'],
  };

  return (
    <div className="w-full flex justify-center items-center py-2 overflow-x-auto custom-scrollbar">
      <div className="min-w-max">
        <GitHubCalendar
          username={username}
          blockSize={12}
          blockMargin={4}
          fontSize={12}
          theme={explicitTheme}
          colorScheme="dark"
        />
      </div>
    </div>
  );
}
