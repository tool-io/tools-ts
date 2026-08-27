import { describe, expect, it } from "vitest";
import { enobFromSnrExample, runEnobFromSnr } from "./tool.js";

describe("ENOB From SNR", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runEnobFromSnr(enobFromSnrExample.input)).toEqual({
      ok: true,
      output: { effectiveNumberOfBits: 3.0299003322259135 },
    }));
  it("reports negative bits for SNR below the quantization floor", () =>
    expect(runEnobFromSnr({ snrDb: 0 })).toEqual({
      ok: true,
      output: { effectiveNumberOfBits: -0.292358803986711 },
    }));
  it("reports sixteen bits for an ideal sixteen-bit SNR", () =>
    expect(runEnobFromSnr({ snrDb: 49.92 })).toEqual({
      ok: true,
      output: { effectiveNumberOfBits: 8.000000000000002 },
    }));
  it("accepts any finite SNR including negative values", () =>
    expect(runEnobFromSnr({ snrDb: -6.02 })).toEqual({
      ok: true,
      output: { effectiveNumberOfBits: -1.2923588039867109 },
    }));
  it("rejects non-finite SNR", () =>
    expect(runEnobFromSnr({ snrDb: Number.POSITIVE_INFINITY })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "snrDb" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runEnobFromSnr({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "snrDb" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runEnobFromSnr({ ...enobFromSnrExample.input, extra: true } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
