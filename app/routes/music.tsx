import { Outlet } from "@remix-run/react";

export default function MusicLayout() {
  return (
    <div className="flex flex-col justify-center w-full py-4">
      <h1 className="text-2xl">Music</h1>
      <Outlet />
    </div>
  );
}
