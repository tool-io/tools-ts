import { describe, expect, it } from "vitest";
import { dacInlExample, runDacInl } from "./tool.js";

const outputOf = (input: {
  lsbSizeVolts: number;
  maxDeviationVolts: number;
}) => {
  const result = runDacInl(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { inlLsbCount: number };
};

describe("DAC INL LSB", () => {
  it("reproduces the canonical example", () =>
    expect(runDacInl(dacInlExample.input)).toEqual({
      ok: true,
      output: { inlLsbCount: 5 },
    }));

  it("divides deviation by LSB size", () => {
    const { inlLsbCount } = outputOf({
      lsbSizeVolts: 0.000244140625,
      maxDeviationVolts: 0.001,
    });
    expect(inlLsbCount).toBeCloseTo(4.096, 9);
  });

  it("reports zero INL for a perfect transfer curve", () =>
    expect(
      outputOf({ lsbSizeVolts: 0.001, maxDeviationVolts: 0 }).inlLsbCount,
    ).toBe(0));

  it("scales linearly with deviation", () => {
    const base = outputOf({
      lsbSizeVolts: 0.002,
      maxDeviationVolts: 0.001,
    }).inlLsbCount;
    const worse = outputOf({
      lsbSizeVolts: 0.002,
      maxDeviationVolts: 0.004,
    }).inlLsbCount;
    expect(worse).toBeCloseTo(base * 4, 12);
  });

  it("scales inversely with LSB size", () => {
    const coarse = outputOf({
      lsbSizeVolts: 0.004,
      maxDeviationVolts: 0.001,
    }).inlLsbCount;
    const fine = outputOf({
      lsbSizeVolts: 0.001,
      maxDeviationVolts: 0.001,
    }).inlLsbCount;
    expect(fine).toBeCloseTo(coarse * 4, 12);
  });

  it("expresses half an LSB deviations fractionally", () =>
    expect(
      outputOf({ lsbSizeVolts: 0.002, maxDeviationVolts: 0.001 }).inlLsbCount,
    ).toBeCloseTo(0.5, 12));

  it("rejects non-positive LSB sizes", () => {
    expect(runDacInl({ lsbSizeVolts: 0, maxDeviationVolts: 0.005 }).ok).toBe(
      false,
    );
    expect(
      runDacInl({ lsbSizeVolts: -0.001, maxDeviationVolts: 0.005 }).ok,
    ).toBe(false);
  });

  it("rejects negative deviations but accepts zero", () => {
    expect(
      runDacInl({ lsbSizeVolts: 0.001, maxDeviationVolts: -0.001 }).ok,
    ).toBe(false);
    expect(runDacInl({ lsbSizeVolts: 0.001, maxDeviationVolts: 0 }).ok).toBe(
      true,
    );
  });
});
