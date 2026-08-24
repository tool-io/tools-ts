import { describe, expect, it } from "vitest";
import {
  chipletDieToDieLatencyExample,
  runChipletDieToDieLatency,
} from "./tool.js";

describe("Chiplet Latency Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runChipletDieToDieLatency(chipletDieToDieLatencyExample.input),
    ).toEqual({ ok: true, output: { totalLatencyNs: 2.3 } }));

  it("defaults propagation delay and interface overhead", () =>
    expect(runChipletDieToDieLatency({ distanceMm: 20 })).toEqual({
      ok: true,
      output: { totalLatencyNs: 2.3 },
    }));

  it("scales linearly with distance", () =>
    expect(runChipletDieToDieLatency({ distanceMm: 40 })).toEqual({
      ok: true,
      output: { totalLatencyNs: 2.6 },
    }));

  it("accepts explicit delay and zero overhead at the boundary", () =>
    expect(
      runChipletDieToDieLatency({
        distanceMm: 20,
        interfaceOverheadNs: 0,
        propagationDelayPsPerMm: 25,
      }),
    ).toEqual({ ok: true, output: { totalLatencyNs: 0.5 } }));

  it("adds a larger custom overhead", () =>
    expect(
      runChipletDieToDieLatency({
        distanceMm: 10,
        interfaceOverheadNs: 3,
        propagationDelayPsPerMm: 25,
      }),
    ).toEqual({ ok: true, output: { totalLatencyNs: 3.25 } }));

  it("rejects zero distance via schema", () =>
    expect(runChipletDieToDieLatency({ distanceMm: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "distanceMm" }] },
      ok: false,
    }));

  it("rejects negative distance via schema", () =>
    expect(runChipletDieToDieLatency({ distanceMm: -5 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "distanceMm" }] },
      ok: false,
    }));

  it("rejects non-positive propagation delay via schema", () =>
    expect(
      runChipletDieToDieLatency({ distanceMm: 20, propagationDelayPsPerMm: 0 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "propagationDelayPsPerMm" }],
      },
      ok: false,
    }));

  it("rejects negative interface overhead via schema", () =>
    expect(
      runChipletDieToDieLatency({ distanceMm: 20, interfaceOverheadNs: -1 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "interfaceOverheadNs" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runChipletDieToDieLatency({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "distanceMm" }] },
      ok: false,
    }));
});
