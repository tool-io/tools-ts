import { describe, expect, it } from "vitest";
import { runSnrDb, snrDbExample } from "./tool.js";

describe("SNR To dB", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runSnrDb(snrDbExample.input)).toEqual({
      ok: true,
      output: { snrDb: 20 },
    }));
  it("reports 0 dB for unity ratio", () =>
    expect(runSnrDb({ snrLinear: 1 })).toEqual({
      ok: true,
      output: { snrDb: 0 },
    }));
  it("reports negative decibels for ratios below unity", () =>
    expect(runSnrDb({ snrLinear: 0.001 })).toEqual({
      ok: true,
      output: { snrDb: -30 },
    }));
  it("handles non-power-of-ten ratios", () =>
    expect(runSnrDb({ snrLinear: 2 })).toEqual({
      ok: true,
      output: { snrDb: 3.010299956639812 },
    }));
  it("rejects zero ratio", () =>
    expect(runSnrDb({ snrLinear: 0 }).ok).toBe(false));
  it("rejects negative ratio", () =>
    expect(runSnrDb({ snrLinear: -10 }).ok).toBe(false));
  it("rejects non-finite input", () =>
    expect(runSnrDb({ snrLinear: Number.NaN })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "snrLinear" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runSnrDb({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "snrLinear" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runSnrDb({ ...snrDbExample.input, extra: true } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
