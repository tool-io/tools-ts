import { describe, expect, it } from "vitest";
import {
  gasViscosityCarrKobayashiBurrowsExample,
  runGasViscosityCarrKobayashiBurrows,
} from "./tool.js";

describe("gas-viscosity-carr-kobayashi-burrows", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGasViscosityCarrKobayashiBurrows(
        gasViscosityCarrKobayashiBurrowsExample.input,
      ),
    ).toEqual({
      ok: true,
      output: gasViscosityCarrKobayashiBurrowsExample.output,
    });
  });

  it("thickens the gas as pressure rises", () => {
    const low = runGasViscosityCarrKobayashiBurrows({
      pressurePa: 1_000_000,
      temperatureK: 322.0388888888889,
    });
    const high = runGasViscosityCarrKobayashiBurrows({
      pressurePa: 10_000_000,
      temperatureK: 322.0388888888889,
    });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(
      (high.output.gasViscosityPaS as number) >
        (low.output.gasViscosityPaS as number),
    ).toBe(true);
  });
  it("rejects non-positive z factors", () => {
    expect(
      runGasViscosityCarrKobayashiBurrows({
        pressurePa: 6_894_757,
        temperatureK: 322,
        zFactor: 0,
      }).ok,
    ).toBe(false);
  });
});
