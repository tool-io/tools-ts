import { describe, expect, it } from "vitest";
import { runCohensD } from "./tool.js";
describe("cohens d calculator", () => {
  it("returns one for a two-standard-deviation gap with equal SDs", () => {
    const r = runCohensD({
      mean1: 5,
      mean2: 3,
      n1: 30,
      n2: 30,
      sd1: 2,
      sd2: 2,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.cohensD).toBeCloseTo(1, 9);
  });
});
