import { describe, expect, it } from "vitest";
import {
  assessFuturesLiteracyCapability,
  futuresLiteracyExample,
  runFuturesLiteracy,
} from "./tool.js";

describe("futures literacy capability checklist", () => {
  it("reproduces its canonical example", () => {
    expect(runFuturesLiteracy(futuresLiteracyExample.input)).toEqual({
      ok: true,
      output: futuresLiteracyExample.output,
    });
  });

  it("uses default ratings when omitted", () => {
    const result = runFuturesLiteracy({ minimumCompletionPercent: 0 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.completionPercent).toBe(0);
  });

  it("marks fully rated capabilities ready at zero threshold", () => {
    expect(
      assessFuturesLiteracyCapability({
        capabilityRatings: [3, 3, 3, 3, 3, 3],
        minimumCompletionPercent: 0,
      }),
    ).toMatchObject({
      completionPercent: 100,
      nextCapabilities: [],
      ready: true,
    });
  });

  it("rejects a capability rating above three", () => {
    expect(
      runFuturesLiteracy({
        capabilityRatings: [4, 0, 0, 0, 0, 0],
        minimumCompletionPercent: 50,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_capability_rating", field: "capabilityRatings.0" },
        ],
      },
      ok: false,
    });
  });
});
