import { describe, expect, it } from "vitest";
import {
  runSkeletalHyphaeBandRater,
  skeletalHyphaeBandRaterExample,
} from "./tool.js";
describe("Skeletal Band Rater", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSkeletalHyphaeBandRater(skeletalHyphaeBandRaterExample.input),
    ).toEqual({
      ok: true,
      output: skeletalHyphaeBandRaterExample.output,
    });
  });
  it("records partial thickening without inventing a score", () => {
    expect(
      runSkeletalHyphaeBandRater({ banding: "partial-thickening" }),
    ).toEqual({
      ok: true,
      output: { banding: "partial-thickening" },
    });
  });
  it("rejects invalid input", () => {
    expect(
      runSkeletalHyphaeBandRater({
        banding: "banded" as unknown as "fully-banded",
      }).ok,
    ).toBe(false);
  });
});
