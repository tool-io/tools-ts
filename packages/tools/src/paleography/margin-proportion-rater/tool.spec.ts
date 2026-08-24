import { describe, expect, it } from "vitest";
import {
  marginProportionRaterExample,
  runMarginProportionRater,
} from "./tool.js";

describe("margin-proportion-rater", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMarginProportionRater(marginProportionRaterExample.input),
    ).toEqual({ ok: true, output: marginProportionRaterExample.output });
  });

  it("fails equal margins against the rule", () => {
    const result = runMarginProportionRater({
      topMarginMm: 20,
      bottomMarginMm: 20,
      innerMarginMm: 20,
      outerMarginMm: 20,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.followsTwoToOneRule as boolean).toBe(false);
  });

  it("rejects zero margins", () => {
    expect(
      runMarginProportionRater({
        topMarginMm: 0,
        bottomMarginMm: 40,
        innerMarginMm: 20,
        outerMarginMm: 40,
      }).ok,
    ).toBe(false);
  });
});
