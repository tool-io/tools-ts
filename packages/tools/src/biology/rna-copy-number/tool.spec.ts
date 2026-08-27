import { describe, expect, it } from "vitest";
import { runRnaCopyNumber } from "./tool.js";

describe("RNA Copy Number", () => {
  it("calculates a valid result", () =>
    expect(runRnaCopyNumber({ lengthNt: 1000, massNg: 1 })).toEqual({
      ok: true,
      output: { copyCount: 1771176470.5882354 },
    }));
  it("scales linearly with mass and length", () =>
    expect(runRnaCopyNumber({ lengthNt: 2000, massNg: 500 })).toEqual({
      ok: true,
      output: { copyCount: 442794117647.05884 },
    }));
  it("exceeds the equivalent DNA copy count", () => {
    const result = runRnaCopyNumber({ lengthNt: 1000, massNg: 1 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.copyCount as number).toBeGreaterThan(
        926461538.4615386,
      );
  });
  it("rejects zero mass", () =>
    expect(runRnaCopyNumber({ lengthNt: 1000, massNg: 0 }).ok).toBe(false));
  it("rejects negative length", () =>
    expect(runRnaCopyNumber({ lengthNt: -50, massNg: 1 }).ok).toBe(false));
  it("rejects infinite mass", () =>
    expect(runRnaCopyNumber({ lengthNt: 1000, massNg: Infinity }).ok).toBe(
      false,
    ));
});
