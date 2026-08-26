import { describe, expect, it } from "vitest";
import {
  runWindowUwValue,
  windowUwValueExample,
  windowUwValueTool,
} from "./tool.js";

describe("Window Uw Value Calculator", () => {
  it("computes the canonical example", () =>
    expect(runWindowUwValue(windowUwValueExample.input)).toEqual({
      ok: true,
      output: { uwWPerM2K: 1.1500000000000001 },
    }));

  it("applies all defaults", () =>
    expect(runWindowUwValue({})).toEqual({
      ok: true,
      output: { uwWPerM2K: 1.1500000000000001 },
    }));

  it("returns the glass value for a zero frame share", () =>
    expect(
      runWindowUwValue({ frameShare: 0, frameUValue: 1.3, glassUValue: 1.1 }),
    ).toEqual({
      ok: true,
      output: { uwWPerM2K: 1.1 },
    }));

  it("weights a triple glazing against a warm frame edge", () =>
    expect(
      runWindowUwValue({ frameShare: 0.3, frameUValue: 1.4, glassUValue: 2 }),
    ).toEqual({
      ok: true,
      output: { uwWPerM2K: 1.8199999999999998 },
    }));

  it("accepts the maximum frame share of 0.6", () =>
    expect(
      runWindowUwValue({ frameShare: 0.6, frameUValue: 0.6, glassUValue: 0.5 }),
    ).toEqual({
      ok: true,
      output: { uwWPerM2K: 0.56 },
    }));

  it("accepts the minimum glass U value", () =>
    expect(
      runWindowUwValue({ frameShare: 0, frameUValue: 3, glassUValue: 0.4 }),
    ).toEqual({
      ok: true,
      output: { uwWPerM2K: 0.4 },
    }));

  it("rejects glass U values below 0.4", () => {
    const result = runWindowUwValue({ glassUValue: 0.39 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects frame shares above 0.6 and below zero", () => {
    expect(runWindowUwValue({ frameShare: 0.61 }).ok).toBe(false);
    expect(runWindowUwValue({ frameShare: -0.01 }).ok).toBe(false);
  });

  it("rejects frame U values outside 0.6 to 3", () => {
    expect(runWindowUwValue({ frameUValue: 0.59 }).ok).toBe(false);
    expect(runWindowUwValue({ frameUValue: 3.01 }).ok).toBe(false);
  });

  it("rejects non-finite inputs", () => {
    expect(runWindowUwValue({ glassUValue: Number.NaN }).ok).toBe(false);
    expect(runWindowUwValue({ frameShare: Number.POSITIVE_INFINITY }).ok).toBe(
      false,
    );
  });

  it("rejects unknown input fields", () => {
    const result = runWindowUwValue({
      psiValue: 0.04,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(windowUwValueExample))).toEqual(
      windowUwValueExample,
    );
    expect(windowUwValueTool.id).toBe("carpentry/fenster-uw-wert-berechnung");
    expect(windowUwValueTool.execution).toEqual({ kind: "pure" });
    expect(windowUwValueTool.outputSchema.required).toEqual(["uwWPerM2K"]);
  });
});
