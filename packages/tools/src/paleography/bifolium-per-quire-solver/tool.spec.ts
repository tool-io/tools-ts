import { describe, expect, it } from "vitest";
import {
  bifoliumPerQuireSolverExample,
  runBifoliumPerQuireSolver,
} from "./tool.js";

describe("bifolium-per-quire-solver", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBifoliumPerQuireSolver(bifoliumPerQuireSolverExample.input),
    ).toEqual({ ok: true, output: bifoliumPerQuireSolverExample.output });
  });

  it("solves a single senio by default-free explicit input", () => {
    const result = runBifoliumPerQuireSolver({ leavesPerQuire: 6 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.totalLeaves as number).toBe(6);
    expect(result.output.totalBifolia as number).toBe(3);
    expect(result.output.totalPages as number).toBe(12);
  });

  it("rejects odd leaves per quire", () => {
    expect(runBifoliumPerQuireSolver({ leavesPerQuire: 5 }).ok).toBe(false);
  });
});
