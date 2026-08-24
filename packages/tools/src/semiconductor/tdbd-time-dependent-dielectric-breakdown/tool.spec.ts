import { describe, expect, it } from "vitest";
import {
  runTdbdTimeDependentDielectricBreakdown,
  tdbdTimeDependentDielectricBreakdownExample,
} from "./tool.js";

describe("TDDB Lifetime Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runTdbdTimeDependentDielectricBreakdown(
        tdbdTimeDependentDielectricBreakdownExample.input,
      ),
    ).toEqual({ ok: true, output: { lifetimeSeconds: 7.389056098930651e-9 } }));

  it("reduces to e times the characteristic time at equal fields", () =>
    expect(
      runTdbdTimeDependentDielectricBreakdown({
        characteristicFieldMVPerCm: 5,
        characteristicTimeSeconds: 2,
        operatingFieldMVPerCm: 5,
      }),
    ).toEqual({ ok: true, output: { lifetimeSeconds: 5.43656365691809 } }));

  it("shortens lifetime as operating field rises", () =>
    expect(
      runTdbdTimeDependentDielectricBreakdown({
        characteristicFieldMVPerCm: 12,
        characteristicTimeSeconds: 1e-12,
        operatingFieldMVPerCm: 4,
      }),
    ).toEqual({
      ok: true,
      output: { lifetimeSeconds: 2.0085536923187667e-11 },
    }));

  it("scales linearly with characteristic time", () =>
    expect(
      runTdbdTimeDependentDielectricBreakdown({
        characteristicFieldMVPerCm: 10,
        characteristicTimeSeconds: 1,
        operatingFieldMVPerCm: 2,
      }),
    ).toEqual({ ok: true, output: { lifetimeSeconds: 148.4131591025766 } }));

  it("rejects zero characteristic time", () =>
    expect(
      runTdbdTimeDependentDielectricBreakdown({
        characteristicFieldMVPerCm: 10,
        characteristicTimeSeconds: 0,
        operatingFieldMVPerCm: 5,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "degenerate_input", field: "characteristicTimeSeconds" },
        ],
      },
      ok: false,
    }));

  it("rejects zero characteristic field", () =>
    expect(
      runTdbdTimeDependentDielectricBreakdown({
        characteristicFieldMVPerCm: 0,
        characteristicTimeSeconds: 1e-9,
        operatingFieldMVPerCm: 5,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "degenerate_input", field: "characteristicFieldMVPerCm" },
        ],
      },
      ok: false,
    }));

  it("rejects negative operating field", () =>
    expect(
      runTdbdTimeDependentDielectricBreakdown({
        characteristicFieldMVPerCm: 10,
        characteristicTimeSeconds: 1e-9,
        operatingFieldMVPerCm: -5,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "operatingFieldMVPerCm" }],
      },
      ok: false,
    }));

  it("rejects non-finite fields", () =>
    expect(
      runTdbdTimeDependentDielectricBreakdown({
        characteristicFieldMVPerCm: Number.NaN,
        characteristicTimeSeconds: 1e-9,
        operatingFieldMVPerCm: 5,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "characteristicFieldMVPerCm" },
        ],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runTdbdTimeDependentDielectricBreakdown({} as never)).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "characteristicTimeSeconds" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runTdbdTimeDependentDielectricBreakdown({
        characteristicFieldMVPerCm: 10,
        characteristicTimeSeconds: 1e-9,
        extra: null,
        operatingFieldMVPerCm: 5,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
