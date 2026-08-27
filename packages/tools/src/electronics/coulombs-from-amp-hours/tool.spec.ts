import { describe, expect, it } from "vitest";
import {
  runCoulombsFromAmpHours,
  coulombsFromAmpHoursExample,
} from "./tool.js";

describe("Coulombs From Ah", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runCoulombsFromAmpHours(coulombsFromAmpHoursExample.input)).toEqual({
      ok: true,
      output: coulombsFromAmpHoursExample.output,
    }));
  it("maps one amp-hour to 3600 coulombs", () =>
    expect(runCoulombsFromAmpHours({ ampHours: 1 })).toEqual({
      ok: true,
      output: { chargeCoulombs: 3600 },
    }));
  it("accepts zero charge", () =>
    expect(runCoulombsFromAmpHours({ ampHours: 0 })).toEqual({
      ok: true,
      output: { chargeCoulombs: 0 },
    }));
  it("converts fractional milliamp-scale packs", () =>
    expect(runCoulombsFromAmpHours({ ampHours: 0.0025 })).toEqual({
      ok: true,
      output: { chargeCoulombs: 9 },
    }));
  it("rejects negative amp-hours as an invalid field", () =>
    expect(runCoulombsFromAmpHours({ ampHours: -1 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "ampHours" }] },
      ok: false,
    }));
  it("rejects non-finite input", () =>
    expect(
      runCoulombsFromAmpHours({ ampHours: Number.POSITIVE_INFINITY }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "ampHours" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runCoulombsFromAmpHours({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "ampHours" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runCoulombsFromAmpHours({
        ...coulombsFromAmpHoursExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
