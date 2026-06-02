"use client";

import { useState } from "react";

import HallMap from "@/components/map/HallMap";
import booths from "@/data/hall-layout.json";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);

  const filtered = booths.filter(
    (booth) =>
      booth.id
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      booth.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <main className="h-screen flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b bg-white">
        <input
          className="border rounded px-3 py-2 w-full max-w-md"
          placeholder="Search booth or exhibitor"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Search Results */}
      {search.length > 0 && (
        <div className="absolute top-16 left-4 z-50 w-96 rounded-xl border bg-white shadow-lg">
          {filtered.slice(0, 10).map((booth) => (
            <button
              key={booth.id}
              className="block w-full border-b p-3 text-left hover:bg-slate-100"
              onClick={() =>
                setSelectedBooth(booth.id)
              }
            >
              <div className="font-semibold">
                {booth.id}
              </div>

              <div className="text-sm text-slate-500">
                {booth.name}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 3D Map */}
      <div className="flex-1">
        <HallMap
          booths={filtered}
          selectedBooth={selectedBooth}
        />
      </div>
    </main>
  );
}