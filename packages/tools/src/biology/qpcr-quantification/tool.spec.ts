import { describe, expect, it } from "vitest";
import { runQpcrQuantification } from "./tool.js";

describe("qPCR Copy Number", () => {
  it("converts mass and length to molecule count", () =>
    expect(runQpcrQuantification({ lengthBp: 500, massNg: 50 })).toEqual({
      ok: true,
      output: { moleculeCount: 92646153846.15385 },
    }));
  it("converts a longer template", () =>
    expect(runQpcrQuantification({ lengthBp: 3000, massNg: 100 })).toEqual({
      ok: true,
      output: { moleculeCount: 30882051282.051285 },
    }));
  it("supports sub nanogram masses", () =>
    expect(runQpcrQuantification({ lengthBp: 250, massNg: 0.5 })).toEqual({
      ok: true,
      output: { moleculeCount: 1852923076.923077 },
    }));
  it("rejects zero mass", () => {
    const result = runQpcrQuantification({ lengthBp: 500, massNg: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_mass");
  });
  it("rejects negative mass", () => {
    const result = runQpcrQuantification({ lengthBp: 500, massNg: -10 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_mass");
  });
  it("rejects zero length", () => {
    const result = runQpcrQuantification({ lengthBp: 0, massNg: 50 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_length");
  });
});
