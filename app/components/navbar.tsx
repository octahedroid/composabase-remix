import { Button } from "~/components/ui/button";
import {
  LayoutGrid,
  Library,
  ListMusic,
  Mic2,
  Music2,
  PlayCircle,
  Radio,
  User,
  CameraIcon,
  LucideTv,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Link, useLocation } from "@remix-run/react";

export function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className={cn("pb-12")}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Music
          </h2>
          <ul className="space-y-1">
            <li>
              <Button
                variant={pathname === "/music" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <Link to={"/music"}>
                  <Library className="mr-2 h-4 w-4" />
                  Album List
                </Link>
              </Button>
            </li>
            <li>
              <Button
                variant={pathname === "/music/add" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <Link to={"/music/add"}>
                  <Mic2 className="mr-2 h-4 w-4" />
                  Add Album
                </Link>
              </Button>
            </li>
          </ul>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Movies
          </h2>
          <ul className="space-y-1">
            <li>
              <Button
                variant={pathname === "/movies" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <Link to={"/movies"}>
                  <LucideTv className="mr-2 h-4 w-4" />
                  Movie List
                </Link>
              </Button>
            </li>
          </ul>
          <ul className="space-y-1">
            <li>
              <Button
                variant={pathname === "/movies/add" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <Link to={"/movies/add"}>
                  <CameraIcon className="mr-2 h-4 w-4" />
                  Add Movie
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
