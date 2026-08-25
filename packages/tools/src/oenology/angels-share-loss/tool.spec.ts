import { describe, expect, it } from "vitest";
import {
  angelsShareLossExample,
  angelsShareLossTool,
  runAngelsShareLoss,
} from "./tool.js";

describe("angelsShareLossTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runAngelsShareLoss(angelsShareLossExample.input)).toEqual({
      ok: true,
      output: angelsShareLossExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(angelsShareLossExample))).toEqual(
      angelsShareLossExample,
    );
    expect(angelsShareLossTool.contractVersion).toBe(1);
    expect(angelsShareLossTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runAngelsShareLoss(null).ok).toBe(false);
    expect(
      runAngelsShareLoss({
        ...angelsShareLossExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("compounds the annual loss against remaining wine", () => {
    const short = runAngelsShareLoss({
      ...angelsShareLossExample.input,
      agingMonths: 6,
    });
    expect(short.ok && short.output.lossLiters).toBe(2.26136392624);
  });

  it("allows a zero-loss scenario", () => {
    expect(
      runAngelsShareLoss({
        ...angelsShareLossExample.input,
        annualEvaporationRatePercent: 0,
      }),
    ).toEqual({ ok: true, output: { lossLiters: 0 } });
  });
});
