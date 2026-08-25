import { describe, expect, it } from "vitest";
import { runDnaMeltingTempSaltAdjusted } from "./tool.js";

describe("Salt-Adjusted Tm", () => {
  it("applies the default salt concentration", () =>
    expect(
      runDnaMeltingTempSaltAdjusted({ gcFraction: 0.5, lengthBp: 20 }),
    ).toEqual({
      ok: true,
      output: { meltingTempC: 55.402902071977906 },
    }));
  it("raises Tm at higher salt", () =>
    expect(
      runDnaMeltingTempSaltAdjusted({
        gcFraction: 0.5,
        lengthBp: 20,
        saltMolar: 0.1,
      }),
    ).toEqual({
      ok: true,
      output: { meltingTempC: 60.400000000000006 },
    }));
  it("rewards GC rich oligomers", () =>
    expect(
      runDnaMeltingTempSaltAdjusted({ gcFraction: 0.8, lengthBp: 18 }),
    ).toEqual({
      ok: true,
      output: { meltingTempC: 64.92512429420015 },
    }));
  it("handles single nucleotide input", () =>
    expect(
      runDnaMeltingTempSaltAdjusted({ gcFraction: 0.5, lengthBp: 1 }),
    ).toEqual({
      ok: true,
      output: { meltingTempC: -419.5970979280221 },
    }));
  it("rejects zero salt", () => {
    const result = runDnaMeltingTempSaltAdjusted({
      gcFraction: 0.5,
      lengthBp: 20,
      saltMolar: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_salt");
  });
  it("rejects negative salt", () => {
    const result = runDnaMeltingTempSaltAdjusted({
      gcFraction: 0.5,
      lengthBp: 20,
      saltMolar: -0.05,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_salt");
  });
  it("rejects a zero length sequence", () => {
    const result = runDnaMeltingTempSaltAdjusted({
      gcFraction: 0.5,
      lengthBp: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_length");
  });
});
