import { describe, expect, it } from "vitest";
import {
  calculateIdealBodyWeight,
  idealBodyWeightExample,
  runIdealBodyWeight,
} from "./tool.js";
describe("ideal body weight", () => {
  it("publishes an executable example", () =>
    expect(runIdealBodyWeight(idealBodyWeightExample.input)).toEqual({
      ok: true,
      output: idealBodyWeightExample.output,
    }));

  it("rejects non-finite and non-positive heights", () => {
    expect(calculateIdealBodyWeight(Infinity, "male", "devine")).toBeNull();
    expect(calculateIdealBodyWeight(0, "female", "hamwi")).toBeNull();
  });
});
