import { describe, expect, it } from "vitest";
import { runStomatalIndex, stomatalIndexExample } from "./tool.js";

describe("Stomatal Index SI", () => {
  it("publishes an executable example", () =>
    expect(runStomatalIndex(stomatalIndexExample.input)).toEqual({
      ok: true,
      output: stomatalIndexExample.output,
    }));
  it("returns zero with no stomata", () =>
    expect(
      runStomatalIndex({ epidermalCellsInt: 80, stomataCellsInt: 0 }),
    ).toEqual({ ok: true, output: { stomatalIndexPercent: 0 } }));
  it("returns one hundred with no ordinary epidermal cells", () =>
    expect(
      runStomatalIndex({ epidermalCellsInt: 0, stomataCellsInt: 30 }),
    ).toEqual({ ok: true, output: { stomatalIndexPercent: 100 } }));
  it("keeps fractional indices exact", () =>
    expect(
      runStomatalIndex({ epidermalCellsInt: 30, stomataCellsInt: 10 }),
    ).toEqual({ ok: true, output: { stomatalIndexPercent: 25 } }));
  it("rises with the stomata share of cells", () => {
    const low = runStomatalIndex({
      epidermalCellsInt: 90,
      stomataCellsInt: 10,
    });
    const high = runStomatalIndex({
      epidermalCellsInt: 50,
      stomataCellsInt: 50,
    });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(high.output.stomatalIndexPercent as number).toBeGreaterThan(
      low.output.stomatalIndexPercent as number,
    );
  });
  it("rejects an all-zero cell count with invalid_counts", () => {
    const result = runStomatalIndex({
      epidermalCellsInt: 0,
      stomataCellsInt: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects negative counts", () => {
    const result = runStomatalIndex({
      epidermalCellsInt: -5,
      stomataCellsInt: 40,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects non-integer counts", () => {
    const result = runStomatalIndex({
      epidermalCellsInt: 60.5,
      stomataCellsInt: 40,
    });
    expect(result.ok).toBe(false);
  });
});
