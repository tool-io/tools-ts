import { describe, expect, it } from "vitest";
import { runPolyproticPhFirstDissociation } from "./tool.js";
describe("Polyprotic pH First Step", () => {
  it("calculates a valid result", () =>
    expect(
      runPolyproticPhFirstDissociation({ ka1: 7.5e-7, concM: 0.1 }),
    ).toEqual({
      ok: true,
      output: { ph: 3.56246936830415 },
    }));
  it("rejects invalid input", () =>
    expect(
      runPolyproticPhFirstDissociation({ ka1: -7.5e-7, concM: 0.1 }).ok,
    ).toBe(false));
});
