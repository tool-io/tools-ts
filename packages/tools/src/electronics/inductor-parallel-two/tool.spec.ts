import { describe, expect, it } from "vitest";
import { runInductorParallelTwo } from "./tool.js";
describe("Parallel Inductors", () => {
  it("calculates a valid result", () =>
    expect(runInductorParallelTwo({ l1H: 0.002, l2H: 0.002 })).toEqual({
      ok: true,
      output: { totalInductanceH: 0.001 },
    }));
  it("calculates unequal inductances", () =>
    expect(runInductorParallelTwo({ l1H: 0.003, l2H: 0.006 })).toEqual({
      ok: true,
      output: { totalInductanceH: 0.002 },
    }));
  it("rejects zero inductance one", () => {
    const result = runInductorParallelTwo({ l1H: 0, l2H: 0.004 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "l1H",
      });
  });
  it("rejects negative inductance two", () => {
    const result = runInductorParallelTwo({ l1H: 0.002, l2H: -0.001 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "l2H",
      });
  });
  it("rejects non-finite input", () =>
    expect(runInductorParallelTwo({ l1H: Number.NaN, l2H: 1 }).ok).toBe(false));
  it("rejects an unknown field", () => {
    const result = runInductorParallelTwo({ l1H: 1, l2H: 2, extra: 3 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runInductorParallelTwo({ l2H: 1 }).ok).toBe(false));
});
