import { describe, expect, it } from "vitest";
import {
  runScheduleFootSample,
  sampleScheduleFootTie,
  scheduleFootSampleExample,
} from "./tool.js";

describe("client schedule foot-tie sampler", () => {
  it("reproduces its canonical example", () => {
    expect(runScheduleFootSample(scheduleFootSampleExample.input)).toEqual({
      ok: true,
      output: scheduleFootSampleExample.output,
    });
  });

  it("accepts differences exactly at tolerance", () => {
    expect(
      sampleScheduleFootTie({
        ledgerTotal: 100,
        sampledBalances: [50, 50],
        sampledFootTotal: 101,
        tolerance: 1,
      }).reconciled,
    ).toBe(true);
  });

  it("reports foot and ledger differences separately", () => {
    expect(
      sampleScheduleFootTie({
        ledgerTotal: 105,
        sampledBalances: [50, 50],
        sampledFootTotal: 99,
        tolerance: 0,
      }),
    ).toMatchObject({
      footDifference: -1,
      ledgerDifference: -5,
      reconciled: false,
    });
  });

  it("rejects an empty sample", () => {
    expect(
      runScheduleFootSample({
        ledgerTotal: 0,
        sampledBalances: [],
        sampledFootTotal: 0,
        tolerance: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "sampled_balances_required", field: "sampledBalances" },
        ],
      },
      ok: false,
    });
  });
});
