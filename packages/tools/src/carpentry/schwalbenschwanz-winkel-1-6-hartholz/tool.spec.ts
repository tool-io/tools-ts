import { describe, expect, it } from "vitest";
import {
  dovetailAngleHardwoodExample,
  dovetailAngleHardwoodTool,
  runDovetailAngleHardwood,
} from "./tool.js";

describe("Dovetail Angle Hardwood", () => {
  it("computes the canonical example", () =>
    expect(
      runDovetailAngleHardwood(dovetailAngleHardwoodExample.input),
    ).toEqual({ ok: true, output: { angleDegrees: 9.462322208025617 } }));

  it("applies the default 1:6 ratio when omitted", () =>
    expect(runDovetailAngleHardwood({})).toEqual({
      ok: true,
      output: { angleDegrees: 9.462322208025617 },
    }));

  it.each([
    [2, 26.56505117707799],
    [4, 14.036243467926477],
    [8, 7.125016348901798],
  ])("slopes 1:%p at %p degrees", (slopeRatioDenominator, expected) =>
    expect(runDovetailAngleHardwood({ slopeRatioDenominator })).toEqual({
      ok: true,
      output: { angleDegrees: expected },
    }),
  );

  it("lowers the angle as the ratio grows", () => {
    const shallow = runDovetailAngleHardwood({ slopeRatioDenominator: 4 });
    const steep = runDovetailAngleHardwood({ slopeRatioDenominator: 12 });
    expect(shallow.ok && steep.ok).toBe(true);
    if (shallow.ok && steep.ok)
      expect(
        (steep.output as { angleDegrees: number }).angleDegrees,
      ).toBeLessThan((shallow.output as { angleDegrees: number }).angleDegrees);
  });

  it("rejects a denominator below two", () => {
    const result = runDovetailAngleHardwood({ slopeRatioDenominator: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects zero and negative denominators", () => {
    expect(runDovetailAngleHardwood({ slopeRatioDenominator: 0 }).ok).toBe(
      false,
    );
    expect(runDovetailAngleHardwood({ slopeRatioDenominator: -6 }).ok).toBe(
      false,
    );
  });

  it("rejects fractional and non-finite denominators", () => {
    expect(runDovetailAngleHardwood({ slopeRatioDenominator: 6.5 }).ok).toBe(
      false,
    );
    expect(
      runDovetailAngleHardwood({ slopeRatioDenominator: Number.NaN }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric denominators", () =>
    expect(
      runDovetailAngleHardwood({ slopeRatioDenominator: "6" } as never).ok,
    ).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runDovetailAngleHardwood({
      slopeRatioDenominator: 6,
      woodType: "oak",
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(dovetailAngleHardwoodExample))).toEqual(
      dovetailAngleHardwoodExample,
    );
    expect(dovetailAngleHardwoodTool.id).toBe(
      "carpentry/schwalbenschwanz-winkel-1-6-hartholz",
    );
    expect(dovetailAngleHardwoodTool.execution).toEqual({ kind: "pure" });
  });
});
