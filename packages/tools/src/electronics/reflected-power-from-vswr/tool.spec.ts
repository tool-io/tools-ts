import { describe, expect, it } from "vitest";
import {
  reflectedPowerFromVswrExample,
  runReflectedPowerFromVswr,
} from "./tool.js";

describe("Reflected Power %", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runReflectedPowerFromVswr(reflectedPowerFromVswrExample.input),
    ).toEqual({ ok: true, output: reflectedPowerFromVswrExample.output }));

  it("returns zero reflected power for a matched line", () =>
    expect(runReflectedPowerFromVswr({ vswr: 1 })).toEqual({
      ok: true,
      output: { reflectedPowerPercent: 0 },
    }));

  it("maps a VSWR of three to 25 percent reflected power", () =>
    expect(runReflectedPowerFromVswr({ vswr: 3 })).toEqual({
      ok: true,
      output: { reflectedPowerPercent: 25 },
    }));

  it("approaches full reflection for large VSWR values", () =>
    expect(runReflectedPowerFromVswr({ vswr: 9 })).toMatchObject({
      ok: true,
      output: { reflectedPowerPercent: 64.00000000000001 },
    }));

  it("grows monotonically with VSWR", () => {
    const low = runReflectedPowerFromVswr({ vswr: 1.5 });
    const high = runReflectedPowerFromVswr({ vswr: 4 });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(high.output.reflectedPowerPercent).toBeGreaterThan(
      Number(low.output.reflectedPowerPercent),
    );
  });

  it("rejects a VSWR below one", () =>
    expect(runReflectedPowerFromVswr({ vswr: 0.5 })).toMatchObject({
      error: { issues: [{ code: "invalid_vswr", field: "vswr" }] },
      ok: false,
    }));

  it("rejects a negative VSWR", () =>
    expect(runReflectedPowerFromVswr({ vswr: -2 })).toMatchObject({
      error: { issues: [{ code: "invalid_vswr", field: "vswr" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runReflectedPowerFromVswr(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
