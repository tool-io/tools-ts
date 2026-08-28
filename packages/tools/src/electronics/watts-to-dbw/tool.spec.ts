import { describe, expect, it } from "vitest";
import { runWattsToDbw, wattsToDbwExample } from "./tool.js";

describe("Watts To dBW", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runWattsToDbw(wattsToDbwExample.input)).toEqual({
      ok: true,
      output: wattsToDbwExample.output,
    }));
  it("converts one watt to zero dBW", () =>
    expect(runWattsToDbw({ watts: 1 })).toEqual({
      ok: true,
      output: { dbw: 0 },
    }));
  it("converts fractional wattage", () =>
    expect(runWattsToDbw({ watts: 0.1 })).toEqual({
      ok: true,
      output: { dbw: -10 },
    }));
  it("converts two megawatts", () =>
    expect(runWattsToDbw({ watts: 2000000 })).toEqual({
      ok: true,
      output: { dbw: 63.01029995663981 },
    }));
  it("rejects zero watts with a stable code", () =>
    expect(runWattsToDbw({ watts: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "watts" }] },
      ok: false,
    }));
  it("rejects negative watts with a stable code", () =>
    expect(runWattsToDbw({ watts: -5 })).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "watts" }] },
      ok: false,
    }));
  it("rejects non-finite input", () =>
    expect(runWattsToDbw({ watts: Number.POSITIVE_INFINITY })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "watts" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runWattsToDbw({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "watts" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runWattsToDbw({ ...wattsToDbwExample.input, extra: true } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
