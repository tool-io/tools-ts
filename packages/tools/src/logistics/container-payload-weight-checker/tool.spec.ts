import { describe, expect, it } from "vitest";
import {
  calculateContainerPayloadWeightChecker,
  containerPayloadWeightCheckerExample,
  runContainerPayloadWeightChecker,
} from "./tool.js";

describe("container-payload-weight-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runContainerPayloadWeightChecker(
        containerPayloadWeightCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: containerPayloadWeightCheckerExample.output,
    });
  });

  it("flags loads that exceed the payload limit", () => {
    const result = runContainerPayloadWeightChecker({
      cargoWeightKg: 27000,
      packingMaterialKg: 1500,
      maximumPayloadKg: 28000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.withinPayloadLimit).toBe(false);
    expect(result.output.remainingPayloadKg as number).toBe(-500);
  });
  it("rejects negative cargo weight", () => {
    expect(
      runContainerPayloadWeightChecker({
        cargoWeightKg: -1,
        maximumPayloadKg: 28000,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite and overflowing weights", () => {
    expect(() =>
      calculateContainerPayloadWeightChecker({
        cargoWeightKg: Number.NaN,
        maximumPayloadKg: 28000,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateContainerPayloadWeightChecker({
        cargoWeightKg: Number.MAX_VALUE,
        maximumPayloadKg: Number.MAX_VALUE,
        packingMaterialKg: Number.MAX_VALUE,
      }),
    ).toThrow("outside the representable range");
  });
});
