import { describe, expect, it } from "vitest";
import { runKaFromPka, kaFromPkaExample } from "./tool.js";
describe("Ka From pKa", () => {
  it("publishes an executable example", () =>
    expect(runKaFromPka(kaFromPkaExample.input)).toEqual({
      ok: true,
      output: kaFromPkaExample.output,
    }));
  it("converts pKa seven to one times ten to the minus seventh", () =>
    expect(runKaFromPka({ pKa: 7 })).toEqual({
      ok: true,
      output: { ka: 1e-7 },
    }));
  it("maps pKa zero to unity", () =>
    expect(runKaFromPka({ pKa: 0 })).toEqual({
      ok: true,
      output: { ka: 1 },
    }));
  it("handles negative pKa values above one", () =>
    expect(runKaFromPka({ pKa: -1 })).toEqual({
      ok: true,
      output: { ka: 10 },
    }));
  it("accepts fractional pKa values", () =>
    expect(runKaFromPka({ pKa: 4.76 }).ok).toBe(true));
  it("rejects non-numeric input", () =>
    expect(runKaFromPka({ pKa: "acid" }).ok).toBe(false));
  it("rejects non-finite numbers", () =>
    expect(runKaFromPka({ pKa: Number.NaN }).ok).toBe(false));
});
