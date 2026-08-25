import { describe, expect, it } from "vitest";
import {
  redeliveryCostMultiplierFactorExample,
  runRedeliveryCostMultiplierFactor,
} from "./tool.js";

describe("redelivery-cost-multiplier-factor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRedeliveryCostMultiplierFactor(
        redeliveryCostMultiplierFactorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: redeliveryCostMultiplierFactorExample.output,
    });
  });

  it("treats equal costs as a one times factor", () => {
    expect(
      runRedeliveryCostMultiplierFactor({
        originalDeliveryCostUsd: 25,
        redeliveryCostUsd: 25,
      }),
    ).toEqual({ ok: true, output: { redeliveryCostMultiplier: 1 } });
  });

  it("rejects a zero original cost", () => {
    expect(
      runRedeliveryCostMultiplierFactor({
        originalDeliveryCostUsd: 0,
        redeliveryCostUsd: 30,
      }).ok,
    ).toBe(false);
  });
});
