import { describe, expect, it } from "vitest";
import {
  jibOverlapPercentageExample,
  runJibOverlapPercentage,
} from "./tool.js";

describe("Jib Overlap Percentage", () => {
  it("calculates the canonical example", () =>
    expect(runJibOverlapPercentage(jibOverlapPercentageExample.input)).toEqual({
      ok: true,
      output: jibOverlapPercentageExample.output,
    }));
  it("returns one hundred when the jib matches the foretriangle", () =>
    expect(
      runJibOverlapPercentage({ foreTriangleM2: 50, jibAreaM2: 50 }),
    ).toEqual({ ok: true, output: { overlapPercent: 100 } }));
  it("returns fifty for a jib with half the foretriangle area", () =>
    expect(
      runJibOverlapPercentage({ foreTriangleM2: 50, jibAreaM2: 25 }),
    ).toEqual({ ok: true, output: { overlapPercent: 50 } }));
  it("exceeds one hundred percent for large genoas", () =>
    expect(
      runJibOverlapPercentage({ foreTriangleM2: 50, jibAreaM2: 150 }),
    ).toEqual({ ok: true, output: { overlapPercent: 300 } }));
  it("handles fractional overlap ratios", () =>
    expect(
      runJibOverlapPercentage({ foreTriangleM2: 48, jibAreaM2: 60 }),
    ).toEqual({ ok: true, output: { overlapPercent: 125 } }));
  it("rejects a zero jib area", () => {
    const result = runJibOverlapPercentage({
      foreTriangleM2: 50,
      jibAreaM2: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_jib");
  });
  it("rejects a zero foretriangle area", () => {
    const result = runJibOverlapPercentage({
      foreTriangleM2: 0,
      jibAreaM2: 75,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_foretriangle");
  });
  it("rejects negative, missing and malformed areas", () => {
    expect(
      runJibOverlapPercentage({ foreTriangleM2: -1, jibAreaM2: 75 }).ok,
    ).toBe(false);
    expect(runJibOverlapPercentage({}).ok).toBe(false);
    expect(
      runJibOverlapPercentage({ foreTriangleM2: 50, jibAreaM2: "75" }).ok,
    ).toBe(false);
    expect(runJibOverlapPercentage(null).ok).toBe(false);
  });
});
