import { describe, expect, it } from "vitest";
import { runBufferCapacity, bufferCapacityExample } from "./tool.js";
describe("Buffer Capacity Estimate", () => {
  it("publishes an executable example", () =>
    expect(runBufferCapacity(bufferCapacityExample.input)).toEqual({
      ok: true,
      output: bufferCapacityExample.output,
    }));
  it("peaks when hydrogen ion equals Ka for unit concentration", () => {
    const result = runBufferCapacity({
      hPlus: 1e-5,
      ka: 1e-5,
      totalConcentrationM: 1,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.bufferCapacity).toBeCloseTo(0.57575, 12);
  });
  it("drops away from the half-neutralization point", () => {
    const result = runBufferCapacity({
      hPlus: 1e-3,
      ka: 1e-5,
      totalConcentrationM: 0.2,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.bufferCapacity).toBeLessThan(0.11515);
  });
  it("scales linearly with total concentration", () => {
    const result = runBufferCapacity({
      hPlus: 1e-5,
      ka: 1e-5,
      totalConcentrationM: 0.4,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.bufferCapacity).toBeCloseTo(0.2303, 12);
  });
  it("rejects zero hydrogen ion concentration", () =>
    expect(
      runBufferCapacity({ hPlus: 0, ka: 1e-5, totalConcentrationM: 0.2 }).ok,
    ).toBe(false));
  it("rejects negative Ka", () =>
    expect(
      runBufferCapacity({ hPlus: 1e-5, ka: -1e-5, totalConcentrationM: 0.2 })
        .ok,
    ).toBe(false));
  it("rejects zero total concentration", () =>
    expect(
      runBufferCapacity({ hPlus: 1e-5, ka: 1e-5, totalConcentrationM: 0 }).ok,
    ).toBe(false));
});
