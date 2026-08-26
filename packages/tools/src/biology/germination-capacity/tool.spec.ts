import { describe, expect, it } from "vitest";
import { germinationCapacityExample, runGerminationCapacity } from "./tool.js";

describe("Germination Capacity %", () => {
  it("publishes an executable example", () =>
    expect(runGerminationCapacity(germinationCapacityExample.input)).toEqual({
      ok: true,
      output: germinationCapacityExample.output,
    }));
  it("returns zero when nothing germinates", () =>
    expect(
      runGerminationCapacity({ seedsSownInt: 80, totalGerminatedInt: 0 }),
    ).toEqual({
      ok: true,
      output: { germinationCapacityPercent: 0 },
    }));
  it("returns one hundred when all seeds germinate", () =>
    expect(
      runGerminationCapacity({ seedsSownInt: 25, totalGerminatedInt: 25 }),
    ).toEqual({
      ok: true,
      output: { germinationCapacityPercent: 100 },
    }));
  it("rejects totals exceeding sown seeds", () => {
    const result = runGerminationCapacity({
      seedsSownInt: 50,
      totalGerminatedInt: 51,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects zero seeds sown", () =>
    expect(
      runGerminationCapacity({ seedsSownInt: 0, totalGerminatedInt: 0 }).ok,
    ).toBe(false));
  it("rejects non-integer counts", () =>
    expect(
      runGerminationCapacity({ seedsSownInt: 10, totalGerminatedInt: 2.5 }).ok,
    ).toBe(false));
});
