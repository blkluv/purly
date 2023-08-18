import { withAuth } from '../../lib/auth-hoc';
import React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full flex">
      <Sidebar />
      <div className="w-full border-l h-screen overflow-hidden">
        <Header />
        <div className="border-t bg-muted overflow-y-auto w-full h-workspace">
          {children}
        </div>
      </div>
    </div>
  );
};

export default withAuth(AppLayout);
