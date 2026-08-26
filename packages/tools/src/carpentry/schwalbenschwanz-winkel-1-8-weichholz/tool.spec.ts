import { describe, expect, it } from "vitest";
import {
  dovetailAngleSoftwoodExample,
  dovetailAngleSoftwoodTool,
  runDovetailAngleSoftwood,
} from "./tool.js";

describe("Dovetail Angle Softwood", () => {
  it("computes the canonical example", () =>
    expect(
      runDovetailAngleSoftwood(dovetailAngleSoftwoodExample.input),
    ).toEqual({ ok: true, output: { angleDegrees: 7.125016348901798 } }));

  it("applies the default 1:8 ratio when omitted", () =>
    expect(runDovetailAngleSoftwood({})).toEqual({
      ok: true,
      output: { angleDegrees: 7.125016348901798 },
    }));

  it.each([
    [2, 26.56505117707799],
    [6, 9.462322208025617],
    [12, 4.763641690726177],
  ])("slopes 1:%p at %p degrees", (slopeRatioDenominator, expected) =>
    expect(runDovetailAngleSoftwood({ slopeRatioDenominator })).toEqual({
      ok: true,
      output: { angleDegrees: expected },
    }),
  );

  it("lowers the angle as the ratio grows", () => {
    const shallow = runDovetailAngleSoftwood({ slopeRatioDenominator: 4 });
    const steep = runDovetailAngleSoftwood({ slopeRatioDenominator: 16 });
    expect(shallow.ok && steep.ok).toBe(true);
    if (shallow.ok && steep.ok)
      expect(
        (steep.output as { angleDegrees: number }).angleDegrees,
      ).toBeLessThan((shallow.output as { angleDegrees: number }).angleDegrees);
  });

  it("rejects a denominator below two", () => {
    const result = runDovetailAngleSoftwood({ slopeRatioDenominator: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects zero and negative denominators", () => {
    expect(runDovetailAngleSoftwood({ slopeRatioDenominator: 0 }).ok).toBe(
      false,
    );
    expect(runDovetailAngleSoftwood({ slopeRatioDenominator: -8 }).ok).toBe(
      false,
    );
  });

  it("rejects fractional and non-finite denominators", () => {
    expect(runDovetailAngleSoftwood({ slopeRatioDenominator: 8.5 }).ok).toBe(
      false,
    );
    expect(
      runDovetailAngleSoftwood({ slopeRatioDenominator: Number.NaN }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric denominators", () =>
    expect(
      runDovetailAngleSoftwood({ slopeRatioDenominator: "8" } as never).ok,
    ).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runDovetailAngleSoftwood({
      slopeRatioDenominator: 8,
      woodType: "pine",
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(dovetailAngleSoftwoodExample))).toEqual(
      dovetailAngleSoftwoodExample,
    );
    expect(dovetailAngleSoftwoodTool.id).toBe(
      "carpentry/schwalbenschwanz-winkel-1-8-weichholz",
    );
    expect(dovetailAngleSoftwoodTool.execution).toEqual({ kind: "pure" });
  });
});
