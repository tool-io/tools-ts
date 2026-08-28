import { describe, expect, it } from "vitest";
import { paEfficiencyPaeExample, runPaEfficiencyPae } from "./tool.js";
describe("PAE Calculator", () => {
  it("publishes an executable example", () =>
    expect(runPaEfficiencyPae(paEfficiencyPaeExample.input)).toEqual({
      ok: true,
      output: paEfficiencyPaeExample.output,
    }));
  it("allows zero added power for a lossless driver", () =>
    expect(
      runPaEfficiencyPae({
        rfOutputWatts: 5,
        rfInputWatts: 5,
        dcSupplyWatts: 10,
      }),
    ).toEqual({ ok: true, output: { powerAddedEfficiencyPercent: 0 } }));
  it("rejects zero DC supply power", () =>
    expect(
      runPaEfficiencyPae({
        rfOutputWatts: 5,
        rfInputWatts: 1,
        dcSupplyWatts: 0,
      }).ok,
    ).toBe(false));
  it("rejects output below input", () =>
    expect(
      runPaEfficiencyPae({
        rfOutputWatts: 1,
        rfInputWatts: 2,
        dcSupplyWatts: 10,
      }).ok,
    ).toBe(false));
});
