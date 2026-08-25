import { describe, expect, it } from "vitest";
import { runDnaCopyNumber } from "./tool.js";

describe("DNA Copy Number", () => {
  it("calculates a valid result", () =>
    expect(runDnaCopyNumber({ lengthBp: 1000, massNg: 1 })).toEqual({
      ok: true,
      output: { copyCount: 926461538.4615386 },
    }));
  it("scales linearly with mass and length", () =>
    expect(runDnaCopyNumber({ lengthBp: 3000, massNg: 250 })).toEqual({
      ok: true,
      output: { copyCount: 77205128205.12822 },
    }));
  it("rejects zero mass", () =>
    expect(runDnaCopyNumber({ lengthBp: 1000, massNg: 0 }).ok).toBe(false));
  it("rejects negative mass", () =>
    expect(runDnaCopyNumber({ lengthBp: 1000, massNg: -1 }).ok).toBe(false));
  it("rejects zero length", () =>
    expect(runDnaCopyNumber({ lengthBp: 0, massNg: 1 }).ok).toBe(false));
  it("rejects infinite mass", () =>
    expect(runDnaCopyNumber({ lengthBp: 1000, massNg: Infinity }).ok).toBe(
      false,
    ));
});
