"use client";

import { TaskManager } from "@/components/tasks/TaskManager";
import { ThemeSwitcher } from "@/components/theme-switcher/ThemeSwitcher";
import { Container, Typography, AppBar, Toolbar } from "@mui/material";
import { useTheme } from "@/theme/ThemeContext";

export default function Home() {
  const { currentTheme } = useTheme();

  return (
    <>
      {currentTheme === 'material' ? (
        // Affichage pour Material UI
        <>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                TaskMaster Pro
              </Typography>
              <ThemeSwitcher />
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <TaskManager />
          </Container>
        </>
      ) : (
        // Affichage pour ShadCN
        <>
          <header className="border-b bg-background">
            <div className="container flex h-14 items-center px-4">
              <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <div className="w-full flex-1">
                  <h1 className="text-xl font-bold">TaskMaster Pro</h1>
                </div>
                <ThemeSwitcher />
              </div>
            </div>
          </header>
          <main className="container mx-auto p-4 md:p-6">
            <TaskManager />
          </main>
        </>
      )}
    </>
  );
}
