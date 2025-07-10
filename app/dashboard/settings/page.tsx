import type { Metadata } from "next";
import Settings from "./components/Settings";



export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
};

export default async function SettingsPage() {


  return (
   <div>
    <Settings/>
   </div>
  );
}
