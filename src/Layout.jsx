import React from 'react';
import { Toaster } from 'sonner';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <style>{`
        :root {
          --background: 9 9 11;
          --foreground: 250 250 250;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgb(24 24 27);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgb(63 63 70);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgb(82 82 91);
        }
      `}</style>
      <Toaster 
        position="bottom-right" 
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgb(24 24 27)',
            border: '1px solid rgb(39 39 42)',
            color: 'white',
          },
        }}
      />
      {children}
    </div>
  );
}