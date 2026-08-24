import { describe, expect, it } from "vitest";
import { runEpgMcmasterCalculator } from "./tool.js";
describe("McMaster EPG Calculator", () => {
  it("calculates with the default factor", () =>
    expect(runEpgMcmasterCalculator({ eggsCounted: 4 })).toEqual({
      ok: true,
      output: { eggsPerGram: 200 },
    }));
  it("yields zero without eggs", () =>
    expect(runEpgMcmasterCalculator({ eggsCounted: 0 })).toEqual({
      ok: true,
      output: { eggsPerGram: 0 },
    }));
  it("honors a custom dilution factor", () =>
    expect(
      runEpgMcmasterCalculator({ chamberFactor: 100, eggsCounted: 3 }),
    ).toEqual({ ok: true, output: { eggsPerGram: 300 } }));
  it("supports undiluted factors", () =>
    expect(
      runEpgMcmasterCalculator({ chamberFactor: 1, eggsCounted: 25 }),
    ).toEqual({ ok: true, output: { eggsPerGram: 25 } }));
  it("scales with heavier infections", () =>
    expect(runEpgMcmasterCalculator({ eggsCounted: 12 })).toEqual({
      ok: true,
      output: { eggsPerGram: 600 },
    }));
  it("rejects negative counts", () =>
    expect(runEpgMcmasterCalculator({ eggsCounted: -1 }).ok).toBe(false));
  it("rejects zero chamber factors", () =>
    expect(
      runEpgMcmasterCalculator({ chamberFactor: 0, eggsCounted: 4 }).ok,
    ).toBe(false));
  it("rejects fractional egg counts", () =>
    expect(runEpgMcmasterCalculator({ eggsCounted: 2.5 }).ok).toBe(false));
});
