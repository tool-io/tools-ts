import { describe, expect, it } from "vitest";
import { runForce } from "./tool.js";

describe("Force Calculator", () => {
  it("calculates a valid result", () => {
    expect(runForce({ accelerationMs2: 3, massKg: 4 })).toEqual({
      ok: true,
      output: { newtons: 12 },
    });
  });

  it("rejects invalid input", () => expect(runForce(null).ok).toBe(false));
});
