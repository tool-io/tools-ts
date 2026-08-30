import { describe, expect, it } from "vitest";
import {
  integralFuturesExample,
  lookupIntegralFuturesQuadrant,
  runIntegralFutures,
} from "./tool.js";

describe("Integral futures four-quadrant approach lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runIntegralFutures(integralFuturesExample.input)).toEqual({
      ok: true,
      output: integralFuturesExample.output,
    });
  });

  it("looks up the upper-right quadrant", () => {
    expect(
      lookupIntegralFuturesQuadrant({ quadrant: "upperRight" }).focus,
    ).toContain("Agency");
  });

  it("looks up the lower-right quadrant", () => {
    expect(
      lookupIntegralFuturesQuadrant({ quadrant: "lowerRight" }).caution,
    ).toContain("Externalization");
  });

  it("rejects an unsupported quadrant at the public boundary", () => {
    expect(runIntegralFutures({ quadrant: "center" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "quadrant" }] },
      ok: false,
    });
  });
});
