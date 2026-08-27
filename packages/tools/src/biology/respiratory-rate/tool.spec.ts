import { describe, expect, it } from "vitest";
import { respiratoryRateExample, runRespiratoryRate } from "./tool.js";

describe("Respiratory Rate Check", () => {
  it("publishes an executable example", () =>
    expect(runRespiratoryRate(respiratoryRateExample.input)).toEqual({
      ok: true,
      output: respiratoryRateExample.output,
    }));
  it("marks the inclusive lower bound as normal", () =>
    expect(runRespiratoryRate({ breathsPerMin: 12 })).toEqual({
      ok: true,
      output: { breathsPerMinute: 12, normalRange: true },
    }));
  it("marks the inclusive upper bound as normal", () =>
    expect(runRespiratoryRate({ breathsPerMin: 20 })).toEqual({
      ok: true,
      output: { breathsPerMinute: 20, normalRange: true },
    }));
  it("flags bradypnea below the range", () =>
    expect(runRespiratoryRate({ breathsPerMin: 11 })).toEqual({
      ok: true,
      output: { breathsPerMinute: 11, normalRange: false },
    }));
  it("flags tachypnea above the range", () =>
    expect(runRespiratoryRate({ breathsPerMin: 21 })).toEqual({
      ok: true,
      output: { breathsPerMinute: 21, normalRange: false },
    }));
  it("accepts the extreme supported rates", () => {
    expect(runRespiratoryRate({ breathsPerMin: 6 })).toEqual({
      ok: true,
      output: { breathsPerMinute: 6, normalRange: false },
    });
    expect(runRespiratoryRate({ breathsPerMin: 60 })).toEqual({
      ok: true,
      output: { breathsPerMinute: 60, normalRange: false },
    });
  });
  it("rejects rates outside the supported domain", () => {
    expect(runRespiratoryRate({ breathsPerMin: 5 }).ok).toBe(false);
    expect(runRespiratoryRate({ breathsPerMin: 61 }).ok).toBe(false);
  });
  it("rejects missing inputs", () =>
    expect(runRespiratoryRate({}).ok).toBe(false));
});
