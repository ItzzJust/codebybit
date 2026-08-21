import {
  Button,
  ButtonGroup,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@codebybit/ui";
import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  BlocksIcon,
  GlobeIcon,
  HomeIcon,
  LogInIcon,
  MenuIcon,
  MessageCircleIcon,
  PickaxeIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { ThemeToggle } from "../motion/theme-toggle";
import { Logo } from "./logo";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const navLinks: NavItem[] = [
  {
    exact: true,
    label: "Home",
    to: "/",
    icon: <HomeIcon className="size-4" />,
  },
  {
    label: "Minecraft",
    to: "/resources/minecraft",
    icon: <PickaxeIcon className="size-4" />,
  },
  {
    label: "Roblox",
    to: "/resources/roblox",
    icon: <BlocksIcon className="size-4" />,
  },
  {
    label: "Websites",
    to: "/resources/websites",
    icon: <GlobeIcon className="size-4" />,
  },
  {
    label: "Discord",
    to: "/resources/discord",
    icon: <MessageCircleIcon className="size-4" />,
  },
];

interface NavbarProps {
  title?: string;
}

export function Navbar({ title = "CodeByBit" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const matchRoute = useMatchRoute();

  const isLogin = matchRoute({ to: "/login", fuzzy: true });
  const isRegister = matchRoute({ to: "/register", fuzzy: true });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setMobileMenuOpen(false);
      }
    };

    handleMediaChange(mediaQuery);

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  return (
    <nav className="border-border/40 bg-background/80 fixed top-0 left-0 z-50 h-16 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex min-w-0 shrink items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Logo className="text-primary h-7 w-auto shrink-0" />
          <span className="text-foreground truncate text-lg font-bold tracking-tight">
            {title}
          </span>
        </Link>

        <div className="hidden shrink-0 items-center gap-1 md:flex lg:gap-2">
          {navLinks.map(({ to, label, icon, exact = false }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              activeProps={{
                className: "text-foreground font-semibold bg-accent/60",
              }}
              className="text-muted-foreground hover:bg-accent/40 hover:text-foreground flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            >
              {icon}
              {label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle variant="circle" start="center" />

          <ButtonGroup className="hidden md:flex">
            <Button
              size="icon-lg"
              variant={isLogin ? "default" : "outline"}
              nativeButton={false}
              render={
                <Link to="/login" aria-label="Login">
                  <LogInIcon className="h-5 w-5" />
                </Link>
              }
            />
            <Button
              size="icon-lg"
              variant={isRegister ? "default" : "outline"}
              nativeButton={false}
              render={
                <Link to="/register" aria-label="Register">
                  <UserPlusIcon className="h-5 w-5" />
                </Link>
              }
            />
          </ButtonGroup>

          <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DrawerTrigger
              render={
                <Button
                  size="icon-lg"
                  variant="ghost"
                  className="md:hidden"
                  aria-label={
                    mobileMenuOpen
                      ? "Close navigation menu"
                      : "Open navigation menu"
                  }
                />
              }
            >
              {mobileMenuOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </DrawerTrigger>

            <DrawerContent className="flex max-h-[85vh] flex-col md:hidden">
              <DrawerHeader className="border-border/40 shrink-0 border-b pt-2 pb-4 text-left">
                <DrawerTitle className="flex items-center gap-2 text-base font-semibold">
                  <Logo className="text-primary h-6 w-auto" />
                  <span>Navigation</span>
                </DrawerTitle>
              </DrawerHeader>

              <div className="flex flex-col gap-6 overflow-y-auto p-4 pb-8">
                <nav
                  aria-label="Mobile navigation"
                  className="flex flex-col gap-1.5"
                >
                  {navLinks.map(({ to, label, icon, exact = false }) => (
                    <DrawerClose
                      key={to}
                      render={
                        <Button
                          variant="ghost"
                          nativeButton={false}
                          className="h-12 w-full justify-start gap-2.5 px-3 text-left text-base font-medium"
                          render={
                            <Link
                              to={to}
                              activeOptions={{ exact }}
                              activeProps={{
                                className:
                                  "text-foreground font-semibold bg-accent",
                              }}
                            />
                          }
                        >
                          {icon}
                          {label}
                        </Button>
                      }
                    />
                  ))}
                </nav>

                <div className="border-border/40 flex flex-col gap-2 border-t pt-4">
                  <DrawerClose
                    render={
                      <Button
                        variant={isLogin ? "default" : "outline"}
                        nativeButton={false}
                        className="h-11 w-full justify-center gap-2 text-sm font-medium"
                        render={<Link to="/login" />}
                      />
                    }
                  >
                    <LogInIcon className="h-4 w-4" />
                    <span>Login</span>
                  </DrawerClose>

                  <DrawerClose
                    render={
                      <Button
                        variant={isRegister ? "default" : "outline"}
                        nativeButton={false}
                        className="h-11 w-full justify-center gap-2 text-sm font-medium"
                        render={<Link to="/register" />}
                      />
                    }
                  >
                    <UserPlusIcon className="h-4 w-4" />
                    <span>Register</span>
                  </DrawerClose>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  );
}
