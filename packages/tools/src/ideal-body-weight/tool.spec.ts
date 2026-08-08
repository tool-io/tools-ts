import { describe, expect, it } from "vitest";
import { idealBodyWeightExample, runIdealBodyWeight } from "./tool.js";
describe("ideal body weight", () => {
  it("publishes an executable example", () =>
    expect(runIdealBodyWeight(idealBodyWeightExample.input)).toEqual({
      ok: true,
      output: idealBodyWeightExample.output,
    }));
});
