import { ReactNode } from "react";

interface DashboardGridProps {
    children: ReactNode;
}

export function DashboardGrid({ children }: DashboardGridProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
        </div>
    );
}
