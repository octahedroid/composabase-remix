import { Outlet } from "@remix-run/react";

export default function MovieLayout() {
  return (
    <div className="flex flex-col justify-center w-full py-4">
      <h1 className="text-2xl">Movies</h1>
      <Outlet />
    </div>
  );
}
