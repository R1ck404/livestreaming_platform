"use client"
import React, { createContext, useContext, useState } from 'react';

interface PageUserContextType {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

const PageUserContext = createContext<PageUserContextType | undefined>(undefined);

const usePageUserContext = (): PageUserContextType => {
    const context = useContext(PageUserContext);
    if (!context) {
        throw new Error('usePageUserContext must be used within a PageUserContextProvider');
    }
    return context;
};

export default function PageUserContextProvider({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <PageUserContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed }}>
            {children}
        </PageUserContext.Provider>
    );
};

export { PageUserContextProvider, usePageUserContext };