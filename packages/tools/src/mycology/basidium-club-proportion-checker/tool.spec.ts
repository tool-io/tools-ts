import { describe, expect, it } from "vitest";
import {
  basidiumClubProportionCheckerExample,
  runBasidiumClubProportionChecker,
} from "./tool.js";
describe("Club Proportion Check", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBasidiumClubProportionChecker(
        basidiumClubProportionCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: basidiumClubProportionCheckerExample.output,
    });
  });
  it("reports a squat basidium outside the reference ratio", () => {
    expect(
      runBasidiumClubProportionChecker({
        basidiumLengthUm: 6,
        basidiumWidthUm: 4,
      }),
    ).toEqual({
      ok: true,
      output: {
        lengthToWidthRatio: 1.5,
        withinReferenceRatioRange: false,
      },
    });
  });
  it("supports a caller-defined ratio range", () => {
    expect(
      runBasidiumClubProportionChecker({
        basidiumLengthUm: 6,
        basidiumWidthUm: 4,
        maximumReferenceRatio: 2,
        minimumReferenceRatio: 1,
      }),
    ).toEqual({
      ok: true,
      output: {
        lengthToWidthRatio: 1.5,
        withinReferenceRatioRange: true,
      },
    });
  });
  it("rejects invalid input", () => {
    expect(
      runBasidiumClubProportionChecker({
        basidiumLengthUm: 20,
        basidiumWidthUm: 0,
      }).ok,
    ).toBe(false);
  });
});
