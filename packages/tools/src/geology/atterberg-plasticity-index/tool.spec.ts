import { describe, expect, it } from "vitest";
import {
  atterbergPlasticityIndexExample,
  runAtterbergPlasticityIndex,
} from "./tool.js";

describe("atterberg-plasticity-index", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAtterbergPlasticityIndex(atterbergPlasticityIndexExample.input),
    ).toEqual({
      ok: true,
      output: atterbergPlasticityIndexExample.output,
    });
  });

  it("returns zero for a non-plastic soil with equal limits", () => {
    const result = runAtterbergPlasticityIndex({
      liquidLimitPercent: 25,
      plasticLimitPercent: 25,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.plasticityIndexPercent as number).toBe(0);
  });

  it("rejects a liquid limit below the plastic limit", () => {
    expect(
      runAtterbergPlasticityIndex({
        liquidLimitPercent: 20,
        plasticLimitPercent: 30,
      }).ok,
    ).toBe(false);
  });
});
