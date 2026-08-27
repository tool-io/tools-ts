import { describe, expect, it } from "vitest";
import { friisReceivedPowerExample, runFriisReceivedPower } from "./tool.js";

describe("Friis Received Power", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runFriisReceivedPower(friisReceivedPowerExample.input)).toEqual({
      ok: true,
      output: { receivedPowerDbm: -77.44 },
    }));
  it("reports the constant term for an isotropic unit link", () =>
    expect(
      runFriisReceivedPower({
        distanceKm: 1,
        frequencyMHz: 1,
        grxDb: 0,
        gtxDb: 0,
        ptxDbm: 0,
      }),
    ).toEqual({
      ok: true,
      output: { receivedPowerDbm: -32.44 },
    }));
  it("rejects zero distance", () =>
    expect(
      runFriisReceivedPower({
        ...friisReceivedPowerExample.input,
        distanceKm: 0,
      }).ok,
    ).toBe(false));
  it("rejects zero frequency", () =>
    expect(
      runFriisReceivedPower({
        ...friisReceivedPowerExample.input,
        frequencyMHz: 0,
      }).ok,
    ).toBe(false));
  it("rejects non-finite transmitter power", () =>
    expect(
      runFriisReceivedPower({
        ...friisReceivedPowerExample.input,
        ptxDbm: Number.NaN,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "ptxDbm" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runFriisReceivedPower({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "ptxDbm" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runFriisReceivedPower({
        ...friisReceivedPowerExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
