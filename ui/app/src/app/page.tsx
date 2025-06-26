// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); // Only use if not using middleware redirects
}
