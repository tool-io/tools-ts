import { describe, expect, it } from "vitest";
import { runWorkOfBreathing, workOfBreathingExample } from "./tool.js";

describe("Work Of Breathing", () => {
  it("publishes an executable example", () =>
    expect(runWorkOfBreathing(workOfBreathingExample.input)).toEqual({
      ok: true,
      output: workOfBreathingExample.output,
    }));
  it("accepts zero pressure", () =>
    expect(runWorkOfBreathing({ pressureCmh2o: 0 })).toEqual({
      ok: true,
      output: { workOfBreathingJPerL: 0 },
    }));
  it("converts a high pressure", () =>
    expect(runWorkOfBreathing({ pressureCmh2o: 35 })).toEqual({
      ok: true,
      output: { workOfBreathingJPerL: 3.4335000000000004 },
    }));
  it("converts a fractional pressure", () =>
    expect(runWorkOfBreathing({ pressureCmh2o: 2.5 })).toEqual({
      ok: true,
      output: { workOfBreathingJPerL: 0.24525000000000002 },
    }));
  it("keeps monotonic ordering", () => {
    const lower = runWorkOfBreathing({ pressureCmh2o: 5 });
    const higher = runWorkOfBreathing({ pressureCmh2o: 15 });
    if (lower.ok && higher.ok)
      expect(
        (lower.output.workOfBreathingJPerL as number) <
          (higher.output.workOfBreathingJPerL as number),
      ).toBe(true);
  });
  it("rejects negative pressure", () => {
    const result = runWorkOfBreathing({ pressureCmh2o: -1 });
    expect(result.ok).toBe(false);
  });
  it("rejects non-numeric pressure", () => {
    const result = runWorkOfBreathing({
      pressureCmh2o: "10" as unknown as number,
    });
    expect(result.ok).toBe(false);
  });
});
