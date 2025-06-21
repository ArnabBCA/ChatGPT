"use client";

import WelcomeText from "@/components/welcome-text";
import axios from "axios";
import { useEffect } from "react";

export default function Dashboard() {
  const getAllChats = async () => {
    try {
      const res = await axios.get("/api/chats");
      console.log("Fetched chats:", res.data);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      return [];
    }
  };

  useEffect(() => {
    getAllChats();
  }, []);

  return <WelcomeText />;
}
