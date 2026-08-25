import { describe, expect, it } from "vitest";
import {
  runXerophileAwMinimumThresholdLookup,
  xerophileAwMinimumThresholdLookupExample,
} from "./tool.js";

const thresholds = {
  extremeXerophileMaximumAw: 0.75,
  xerophileMaximumAw: 0.85,
  xerotolerantMaximumAw: 0.91,
};

describe("Water Activity Growth Classifier", () => {
  it("matches the canonical example", () =>
    expect(
      runXerophileAwMinimumThresholdLookup(
        xerophileAwMinimumThresholdLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: xerophileAwMinimumThresholdLookupExample.output,
    }));
  it("classes the lowest bound as extreme-xerophile", () =>
    expect(
      runXerophileAwMinimumThresholdLookup({ ...thresholds, minimumAw: 0.6 }),
    ).toEqual({
      ok: true,
      output: { waterActivityClass: "extreme-xerophile" },
    }));
  it("classes 0.75 as extreme-xerophile", () =>
    expect(
      runXerophileAwMinimumThresholdLookup({ ...thresholds, minimumAw: 0.75 }),
    ).toEqual({
      ok: true,
      output: { waterActivityClass: "extreme-xerophile" },
    }));
  it("classes 0.76 as xerophile", () =>
    expect(
      runXerophileAwMinimumThresholdLookup({ ...thresholds, minimumAw: 0.76 }),
    ).toEqual({
      ok: true,
      output: { waterActivityClass: "xerophile" },
    }));
  it("classes 0.85 as xerophile", () =>
    expect(
      runXerophileAwMinimumThresholdLookup({ ...thresholds, minimumAw: 0.85 }),
    ).toEqual({
      ok: true,
      output: { waterActivityClass: "xerophile" },
    }));
  it("classes 0.91 as xerotolerant", () =>
    expect(
      runXerophileAwMinimumThresholdLookup({ ...thresholds, minimumAw: 0.91 }),
    ).toEqual({
      ok: true,
      output: { waterActivityClass: "xerotolerant" },
    }));
  it("classes near-pure water as mesophile", () =>
    expect(
      runXerophileAwMinimumThresholdLookup({ ...thresholds, minimumAw: 0.98 }),
    ).toEqual({
      ok: true,
      output: { waterActivityClass: "mesophile" },
    }));
  it("rejects values below 0.60", () =>
    expect(
      runXerophileAwMinimumThresholdLookup({ ...thresholds, minimumAw: -0.01 })
        .ok,
    ).toBe(false));
  it("rejects values above 1.00", () =>
    expect(
      runXerophileAwMinimumThresholdLookup({ ...thresholds, minimumAw: 1.01 })
        .ok,
    ).toBe(false));
  it("rejects unordered classification cutoffs", () =>
    expect(
      runXerophileAwMinimumThresholdLookup({
        ...thresholds,
        minimumAw: 0.8,
        xerophileMaximumAw: 0.7,
      }).ok,
    ).toBe(false));
});
