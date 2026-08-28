import { describe, expect, it } from "vitest";
import { runPhWithActivity } from "./tool.js";
describe("pH With Activity", () => {
  it("calculates a valid result", () =>
    expect(runPhWithActivity({ gamma: 0.8, hConcM: 0.001 })).toEqual({
      ok: true,
      output: { ph: 3.0969100130080562 },
    }));
  it("rejects invalid input", () =>
    expect(runPhWithActivity({ gamma: 0.8, hConcM: 0 }).ok).toBe(false));
});
