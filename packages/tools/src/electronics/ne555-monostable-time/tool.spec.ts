import { describe, expect, it } from "vitest";
import { runNe555MonostableTime, ne555MonostableTimeExample } from "./tool.js";

describe("NE555 Monostable Time", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runNe555MonostableTime(ne555MonostableTimeExample.input)).toEqual({
      ok: true,
      output: ne555MonostableTimeExample.output,
    }));
  it("computes a one-second pulse from a classic RC pair", () =>
    expect(
      runNe555MonostableTime({
        capacitanceF: 0.00001,
        rOhms: 90909.09090909091,
      }),
    ).toEqual({ ok: true, output: { pulseWidthSeconds: 1.0000000000000002 } }));
  it("computes a millisecond-scale pulse", () =>
    expect(
      runNe555MonostableTime({ capacitanceF: 0.0000001, rOhms: 47000 }),
    ).toEqual({ ok: true, output: { pulseWidthSeconds: 0.00517 } }));
  it("doubles the pulse width when resistance doubles", () =>
    expect(
      runNe555MonostableTime({
        ...ne555MonostableTimeExample.input,
        rOhms: 20000,
      }),
    ).toEqual({ ok: true, output: { pulseWidthSeconds: 0.022 } }));
  it("rejects zero resistance with a stable code", () =>
    expect(
      runNe555MonostableTime({ capacitanceF: 0.000001, rOhms: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_resistance", field: "rOhms" }] },
      ok: false,
    }));
  it("rejects negative capacitance with a stable code", () =>
    expect(
      runNe555MonostableTime({ capacitanceF: -0.000001, rOhms: 10000 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_capacitance", field: "capacitanceF" }],
      },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runNe555MonostableTime({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "rOhms" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runNe555MonostableTime({
        ...ne555MonostableTimeExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
