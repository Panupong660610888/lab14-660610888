import { useState } from "react";
import UserRegisterCard from "../components/UserRegisterCard";
import type { Registrant } from "../libs/Registrant";

const STORAGE_KEY = "marathon.registrants";

function loadReg(): Registrant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function DashboardPage() {
  const [registrants] = useState<Registrant[]>(loadReg);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      {registrants.length === 0 ? (
        <h4>ยังไม่มีผู้ลงทะเบียน</h4>
      ) : (
        <h4>ผู้ลงทะเบียนแล้ว ({registrants.length} คน)</h4>
      )}
      {registrants.map((registrant) => (
        <UserRegisterCard key={registrant.id} registrant={registrant} />
      ))}
    </div>
  );
}
