import { describe, expect, it } from "vitest";
import {
  runNe555AstableFrequency,
  ne555AstableFrequencyExample,
} from "./tool.js";

describe("NE555 Astable Frequency", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runNe555AstableFrequency(ne555AstableFrequencyExample.input),
    ).toEqual({
      ok: true,
      output: ne555AstableFrequencyExample.output,
    }));
  it("halves the frequency when the timing capacitor doubles", () =>
    expect(
      runNe555AstableFrequency({
        ...ne555AstableFrequencyExample.input,
        capacitanceF: 0.000002,
      }),
    ).toEqual({ ok: true, output: { frequencyHz: 144 } }));
  it("computes a classic one-kilohertz blinker", () =>
    expect(
      runNe555AstableFrequency({
        capacitanceF: 0.000001,
        r1Ohms: 6800,
        r2Ohms: 68000,
      }),
    ).toEqual({ ok: true, output: { frequencyHz: 10.08403361344538 } }));
  it("rejects zero R1 with a stable code", () =>
    expect(
      runNe555AstableFrequency({
        capacitanceF: 0.000001,
        r1Ohms: 0,
        r2Ohms: 2000,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_resistance", field: "r1Ohms" }] },
      ok: false,
    }));
  it("rejects negative R2 with a stable code", () =>
    expect(
      runNe555AstableFrequency({
        capacitanceF: 0.000001,
        r1Ohms: 1000,
        r2Ohms: -1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_resistance", field: "r2Ohms" }] },
      ok: false,
    }));
  it("rejects zero capacitance with a stable code", () =>
    expect(
      runNe555AstableFrequency({
        capacitanceF: 0,
        r1Ohms: 1000,
        r2Ohms: 2000,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_capacitance", field: "capacitanceF" }],
      },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runNe555AstableFrequency({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "r1Ohms" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runNe555AstableFrequency({
        ...ne555AstableFrequencyExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
