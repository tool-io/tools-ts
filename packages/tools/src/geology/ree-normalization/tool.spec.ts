import { describe, expect, it } from "vitest";
import {
  calculateReeNormalization,
  reeNormalizationExample,
  runReeNormalization,
} from "./tool.js";

describe("geology/ree-normalization", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runReeNormalization(reeNormalizationExample.input)).toEqual({
      ok: true,
      output: reeNormalizationExample.output,
    });
  });

  it("returns flat values for chondritic input", () => {
    const output = calculateReeNormalization({
      lanthanumPpm: 0.237,
      ceriumPpm: 0.613,
      praseodymiumPpm: 0.0932,
      neodymiumPpm: 0.457,
      samariumPpm: 0.148,
      europiumPpm: 0.0563,
      gadoliniumPpm: 0.199,
      terbiumPpm: 0.0361,
      dysprosiumPpm: 0.246,
      holmiumPpm: 0.0556,
      erbiumPpm: 0.16,
      thuliumPpm: 0.0247,
      ytterbiumPpm: 0.165,
      lutetiumPpm: 0.0254,
    });
    for (const value of output.normalizedValues) expect(value).toBe(1);
    expect(output.ceriumAnomaly).toBe(1);
    expect(output.europiumAnomaly).toBe(1);
  });

  it("normalizes against PAAS when requested", () => {
    const output = calculateReeNormalization({
      lanthanumPpm: 32,
      ceriumPpm: 63,
      praseodymiumPpm: 7.1,
      neodymiumPpm: 27,
      samariumPpm: 5.9,
      europiumPpm: 1.18,
      gadoliniumPpm: 5.2,
      terbiumPpm: 0.94,
      dysprosiumPpm: 4.68,
      holmiumPpm: 0.99,
      erbiumPpm: 2.85,
      thuliumPpm: 0.3,
      ytterbiumPpm: 1.96,
      lutetiumPpm: 0.217,
      reference: "paas",
    });
    expect(output.normalizedValues.every((value) => value === 1)).toBe(true);
  });

  it("detects a positive europium anomaly", () => {
    const result = runReeNormalization({
      lanthanumPpm: 1,
      ceriumPpm: 1,
      praseodymiumPpm: 1,
      neodymiumPpm: 1,
      samariumPpm: 1,
      europiumPpm: 100,
      gadoliniumPpm: 1,
      terbiumPpm: 1,
      dysprosiumPpm: 1,
      holmiumPpm: 1,
      erbiumPpm: 1,
      thuliumPpm: 1,
      ytterbiumPpm: 1,
      lutetiumPpm: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.europiumAnomaly as number).toBeGreaterThan(10);
  });

  it("rejects non-positive concentrations with structured errors", () => {
    const result = runReeNormalization({
      ...reeNormalizationExample.input,
      europiumPpm: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_concentration",
        field: "europiumPpm",
      });
  });

  it("rejects invalid input shapes", () => {
    expect(runReeNormalization(null).ok).toBe(false);
    expect(
      runReeNormalization({ ...reeNormalizationExample.input, extra: 1 }).ok,
    ).toBe(false);
    expect(
      runReeNormalization({
        ...reeNormalizationExample.input,
        reference: "moon",
      }).ok,
    ).toBe(false);
  });
});
