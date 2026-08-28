import { describe, expect, it } from "vitest";
import { runPhFromPoh } from "./tool.js";
describe("pH From pOH", () => {
  it("calculates a valid result", () =>
    expect(runPhFromPoh({ poh: 3 })).toEqual({
      ok: true,
      output: { ph: 11 },
    }));
  it("rejects invalid input", () =>
    expect(runPhFromPoh({ poh: 15 }).ok).toBe(false));
});
