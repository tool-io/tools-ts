import { describe, expect, it } from "vitest";
import { runVoltsToDbmv, voltsToDbmvExample } from "./tool.js";

describe("Volts To dBmV", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runVoltsToDbmv(voltsToDbmvExample.input)).toEqual({
      ok: true,
      output: { dbmv: 40 },
    }));
  it("reports 60 dBmV for one volt", () =>
    expect(runVoltsToDbmv({ volts: 1 })).toEqual({
      ok: true,
      output: { dbmv: 60 },
    }));
  it("reports 0 dBmV at the 1 mV reference", () =>
    expect(runVoltsToDbmv({ volts: 0.001 })).toEqual({
      ok: true,
      output: { dbmv: 0 },
    }));
  it("rejects zero voltage", () =>
    expect(runVoltsToDbmv({ volts: 0 }).ok).toBe(false));
  it("rejects negative voltage", () =>
    expect(runVoltsToDbmv({ volts: -0.1 }).ok).toBe(false));
  it("rejects non-finite input", () =>
    expect(runVoltsToDbmv({ volts: Number.NaN })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "volts" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runVoltsToDbmv({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "volts" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runVoltsToDbmv({ ...voltsToDbmvExample.input, extra: true } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
