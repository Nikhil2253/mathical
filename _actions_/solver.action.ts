"use server";

import { cookies } from "next/headers";
import type { HistoricSession, SolveResponse } from "@/types/solver.types";

const SOLVER_API_URL =
  process.env.SOLVER_API_URL ?? "http://localhost:8000/v1/solve";
const HISTORY_API_URL =
  process.env.HISTORY_API_URL ?? "http://localhost:8000/v1/history";

const TOKEN_KEY = "mathical_access_token";

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_KEY)?.value;

  if (!token) {
    throw new Error("You must be signed in to do this.");
  }

  return { Authorization: `Bearer ${token}` };
}

export async function solverAction(question: string): Promise<SolveResponse> {
  const trimmed = question.trim();

  if (!trimmed) {
    throw new Error("A question or expression is required.");
  }

  const authHeader = await getAuthHeader();

  const res = await fetch(SOLVER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify({ question: trimmed }),
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  if (!res.ok) {
    throw new Error(`Solver backend responded with status ${res.status}`);
  }

  return (await res.json()) as SolveResponse;
}

export async function getSolveByIdAction(id: string): Promise<SolveResponse> {
  if (!id.trim()) {
    throw new Error("A solve id is required.");
  }

  const authHeader = await getAuthHeader();

  const res = await fetch(`${HISTORY_API_URL}/${id}`, {
    method: "GET",
    headers: {
      ...authHeader,
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  if (res.status === 404) {
    throw new Error("That solve could not be found.");
  }

  if (!res.ok) {
    throw new Error(`Solver backend responded with status ${res.status}`);
  }

  return (await res.json()) as SolveResponse;
}

export async function getRecentSolvesAction(): Promise<HistoricSession[]> {
  const authHeader = await getAuthHeader();

  const res = await fetch(`${HISTORY_API_URL}`, {
    method: "GET",
    headers: {
      ...authHeader,
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  if (!res.ok) {
    throw new Error(`History backend responded with status ${res.status}`);
  }

  return (await res.json()) as HistoricSession[];
}