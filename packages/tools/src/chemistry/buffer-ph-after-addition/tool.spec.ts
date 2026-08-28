import { describe, expect, it } from "vitest";
import { runBufferPhAfterAddition } from "./tool.js";
describe("Buffer pH After Addition", () => {
  it("calculates a valid result", () =>
    expect(
      runBufferPhAfterAddition({ acidM: 1, baseM: 1, nAdd: 0.5, pKa: 4.76 }),
    ).toEqual({
      ok: true,
      output: { ph: 5.237121254719662 },
    }));
  it("reports buffer_exhausted when base exceeds acid", () => {
    const result = runBufferPhAfterAddition({
      acidM: 1,
      baseM: 1,
      nAdd: 1.5,
      pKa: 4.76,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("buffer_exhausted");
  });
  it("rejects invalid input", () =>
    expect(
      runBufferPhAfterAddition({ acidM: -1, baseM: 1, nAdd: 0.5, pKa: 4.76 })
        .ok,
    ).toBe(false));
});
