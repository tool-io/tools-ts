import { describe, expect, it } from "vitest";
import {
  absoluteNeutrophilCountExample,
  runAbsoluteNeutrophilCount,
} from "./tool.js";

describe("ANC Calculator", () => {
  it("publishes an executable example", () =>
    expect(
      runAbsoluteNeutrophilCount(absoluteNeutrophilCountExample.input),
    ).toEqual({
      ok: true,
      output: absoluteNeutrophilCountExample.output,
    }));
  it("computes another valid result", () =>
    expect(
      runAbsoluteNeutrophilCount({ wbcKPerUl: 5, neutrophilPercent: 62 }),
    ).toEqual({ ok: true, output: { ancCellsPerUl: 3100 } }));
  it("handles full neutrophil percentage", () =>
    expect(
      runAbsoluteNeutrophilCount({ wbcKPerUl: 4, neutrophilPercent: 100 }),
    ).toEqual({ ok: true, output: { ancCellsPerUl: 4000 } }));
  it("allows zero neutrophil percentage", () =>
    expect(
      runAbsoluteNeutrophilCount({ wbcKPerUl: 7, neutrophilPercent: 0 }),
    ).toEqual({ ok: true, output: { ancCellsPerUl: 0 } }));
  it("rejects percentage above one hundred", () => {
    const result = runAbsoluteNeutrophilCount({
      wbcKPerUl: 6,
      neutrophilPercent: 100.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("returns zero for a zero white cell count", () =>
    expect(
      runAbsoluteNeutrophilCount({ wbcKPerUl: 0, neutrophilPercent: 60 }),
    ).toEqual({ ok: true, output: { ancCellsPerUl: 0 } }));
  it("rejects negative percentage", () => {
    const result = runAbsoluteNeutrophilCount({
      wbcKPerUl: 6,
      neutrophilPercent: -10,
    });
    expect(result.ok).toBe(false);
  });
});
