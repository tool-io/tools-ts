import { describe, expect, it } from "vitest";
import { runWattsToDbm, wattsToDbmExample } from "./tool.js";

describe("Watts To dBm", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runWattsToDbm(wattsToDbmExample.input)).toEqual({
      ok: true,
      output: wattsToDbmExample.output,
    }));

  it("converts one milliwatt to zero dBm", () =>
    expect(runWattsToDbm({ watts: 0.001 })).toEqual({
      ok: true,
      output: { dbm: 0 },
    }));

  it("converts one kilowatt to sixty dBm", () =>
    expect(runWattsToDbm({ watts: 1000 })).toEqual({
      ok: true,
      output: { dbm: 60 },
    }));

  it("converts half a watt to about twenty-seven dBm", () =>
    expect(runWattsToDbm({ watts: 0.5 })).toEqual({
      ok: true,
      output: { dbm: 26.989700043360187 },
    }));

  it("rises with the input power", () => {
    const lower = runWattsToDbm({ watts: 1 });
    const higher = runWattsToDbm({ watts: 2 });
    expect(lower.ok).toBe(true);
    expect(higher.ok).toBe(true);
    if (!lower.ok || !higher.ok) return;
    expect(Number(higher.output.dbm)).toBeGreaterThan(Number(lower.output.dbm));
  });

  it("rejects zero power", () =>
    expect(runWattsToDbm({ watts: 0 })).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "watts" }] },
      ok: false,
    }));

  it("rejects negative power", () =>
    expect(runWattsToDbm({ watts: -1 })).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "watts" }] },
      ok: false,
    }));
});
