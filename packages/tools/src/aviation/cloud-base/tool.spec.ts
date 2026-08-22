import { describe, expect, it } from "vitest";
import { calculateCloudBase, cloudBaseExample, runCloudBase } from "./tool.js";

describe("cloud base calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCloudBase(cloudBaseExample.input)).toEqual({
      ok: true,
      output: cloudBaseExample.output,
    });
  });

  it("returns the surface when the dew point equals the temperature", () => {
    expect(calculateCloudBase({ dewPointC: 15, temperatureC: 15 })).toEqual({
      cloudBaseFt: 0,
    });
  });

  it("rejects temperatures below the dew point through execution", () => {
    expect(runCloudBase({ dewPointC: 20, temperatureC: 10 })).toMatchObject({
      error: { issues: [{ code: "invalid_spread" }] },
      ok: false,
    });
  });
});
