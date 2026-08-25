import { describe, expect, it } from "vitest";
import { cardiacIndexExample, runCardiacIndex } from "./tool.js";

describe("Cardiac Index", () => {
  it("publishes an executable example", () =>
    expect(runCardiacIndex(cardiacIndexExample.input)).toEqual({
      ok: true,
      output: cardiacIndexExample.output,
    }));
  it("divides cardiac output by body surface area", () =>
    expect(
      runCardiacIndex({ cardiacOutputLPerMin: 4.9, bodySurfaceAreaM2: 1.75 }),
    ).toEqual({
      ok: true,
      output: { cardiacIndex: 2.8000000000000003 },
    }));
  it("returns one for unit inputs", () =>
    expect(
      runCardiacIndex({ cardiacOutputLPerMin: 1, bodySurfaceAreaM2: 1 }),
    ).toEqual({
      ok: true,
      output: { cardiacIndex: 1 },
    }));
  it("handles small body surface area", () =>
    expect(
      runCardiacIndex({ cardiacOutputLPerMin: 3, bodySurfaceAreaM2: 0.5 }),
    ).toEqual({
      ok: true,
      output: { cardiacIndex: 6 },
    }));
  it("rejects zero cardiac output", () => {
    const result = runCardiacIndex({
      cardiacOutputLPerMin: 0,
      bodySurfaceAreaM2: 1.8,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative body surface area", () => {
    const result = runCardiacIndex({
      cardiacOutputLPerMin: 5,
      bodySurfaceAreaM2: -1.8,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects non-finite body surface area", () => {
    const result = runCardiacIndex({
      cardiacOutputLPerMin: 5,
      bodySurfaceAreaM2: Number.POSITIVE_INFINITY,
    });
    expect(result.ok).toBe(false);
  });
});
