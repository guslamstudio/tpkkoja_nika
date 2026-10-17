import React, { Suspense } from 'react';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import LayoutHorizontal from '/src/layout/MainLayout/HorizontalLayout';

export const Route = createFileRoute('/_app')({
  component: AppLayoutRoute,
});

function AppLayoutRoute() {
  return (
    <Suspense
      fallback={
        <div className="preloader-it">
          <div className="loader-pendulums" />
        </div>
      }
    >
      <LayoutHorizontal>
        <Outlet />
      </LayoutHorizontal>
    </Suspense>
  );
}
