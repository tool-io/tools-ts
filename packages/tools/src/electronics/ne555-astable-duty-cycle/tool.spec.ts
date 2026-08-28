import { describe, expect, it } from "vitest";
import {
  runNe555AstableDutyCycle,
  ne555AstableDutyCycleExample,
} from "./tool.js";

describe("NE555 Duty Cycle", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runNe555AstableDutyCycle(ne555AstableDutyCycleExample.input),
    ).toEqual({
      ok: true,
      output: ne555AstableDutyCycleExample.output,
    }));
  it("approaches fifty percent when R1 is negligible", () =>
    expect(
      runNe555AstableDutyCycle({ r1Ohms: 0.0000000001, r2Ohms: 1000 }),
    ).toEqual({ ok: true, output: { dutyCyclePercent: 50.0000000000025 } }));
  it("approaches one hundred percent when R2 is small", () =>
    expect(runNe555AstableDutyCycle({ r1Ohms: 10000, r2Ohms: 0.001 })).toEqual({
      ok: true,
      output: { dutyCyclePercent: 99.99999000000199 },
    }));
  it("returns two-thirds high time for equal resistors", () =>
    expect(runNe555AstableDutyCycle({ r1Ohms: 3300, r2Ohms: 3300 })).toEqual({
      ok: true,
      output: { dutyCyclePercent: 66.66666666666666 },
    }));
  it("rejects an all-zero divider with a stable code", () =>
    expect(runNe555AstableDutyCycle({ r1Ohms: 0, r2Ohms: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_resistance", field: "r1Ohms" }] },
      ok: false,
    }));
  it("rejects non-finite input", () =>
    expect(
      runNe555AstableDutyCycle({ r1Ohms: Number.NaN, r2Ohms: 1000 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "r1Ohms" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runNe555AstableDutyCycle({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "r1Ohms" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runNe555AstableDutyCycle({
        ...ne555AstableDutyCycleExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
