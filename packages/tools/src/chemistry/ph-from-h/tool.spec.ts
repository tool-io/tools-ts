import { describe, expect, it } from "vitest";
import { runPhFromH } from "./tool.js";
describe("pH From H Plus", () => {
  it("calculates a valid result", () =>
    expect(runPhFromH({ hPlusMolPerL: 1e-7 })).toEqual({
      ok: true,
      output: { ph: 7 },
    }));
  it("rejects invalid input", () =>
    expect(runPhFromH({ hPlusMolPerL: 0 }).ok).toBe(false));
});
