import { describe, expect, it } from "vitest";
import { powerLoadingExample, runPowerLoading } from "./tool.js";

describe("power loading calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPowerLoading(powerLoadingExample.input)).toEqual({
      ok: true,
      output: powerLoadingExample.output,
    });
  });

  it("rejects non-positive engine power through execution", () => {
    expect(runPowerLoading({ horsepower: 0, weightLb: 2400 })).toMatchObject({
      error: { issues: [{ code: "invalid_power" }] },
      ok: false,
    });
  });
});
