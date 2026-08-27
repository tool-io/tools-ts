import { describe, expect, it } from "vitest";
import {
  runAmpHoursFromCoulombs,
  ampHoursFromCoulombsExample,
} from "./tool.js";

describe("Ah From Coulombs", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runAmpHoursFromCoulombs(ampHoursFromCoulombsExample.input)).toEqual({
      ok: true,
      output: ampHoursFromCoulombsExample.output,
    }));
  it("maps 3600 coulombs to one amp-hour", () =>
    expect(runAmpHoursFromCoulombs({ coulombs: 3600 })).toEqual({
      ok: true,
      output: { ampHours: 1 },
    }));
  it("accepts zero charge", () =>
    expect(runAmpHoursFromCoulombs({ coulombs: 0 })).toEqual({
      ok: true,
      output: { ampHours: 0 },
    }));
  it("round-trips fractional capacities", () =>
    expect(runAmpHoursFromCoulombs({ coulombs: 9 })).toEqual({
      ok: true,
      output: { ampHours: 0.0025 },
    }));
  it("rejects non-finite input", () =>
    expect(runAmpHoursFromCoulombs({ coulombs: Number.NaN })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "coulombs" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runAmpHoursFromCoulombs({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "coulombs" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runAmpHoursFromCoulombs({
        ...ampHoursFromCoulombsExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
