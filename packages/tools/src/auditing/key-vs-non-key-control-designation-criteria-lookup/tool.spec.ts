import { describe, expect, it } from "vitest";
import {
  designateKeyControl,
  keyControlDesignationExample,
  runKeyControlDesignation,
} from "./tool.js";

describe("key versus non-key control designation", () => {
  it("reproduces its canonical example", () => {
    expect(
      runKeyControlDesignation(keyControlDesignationExample.input),
    ).toEqual({
      ok: true,
      output: keyControlDesignationExample.output,
    });
  });

  it("marks a control as non-key when no criterion is met", () => {
    expect(
      designateKeyControl({
        addressesSignificantRisk: false,
        quantitativeEffect: 100,
        qualitativeRisk: false,
        quantitativeLimit: 1000,
        quantitativeThreshold: 500,
      }),
    ).toEqual({ criteriaMet: [], keyControl: false });
  });

  it("accepts a quantitative value exactly at the threshold", () => {
    expect(
      designateKeyControl({
        addressesSignificantRisk: false,
        quantitativeEffect: 500,
        qualitativeRisk: false,
        quantitativeLimit: 1000,
        quantitativeThreshold: 500,
      }).criteriaMet,
    ).toEqual(["quantitative_threshold"]);
  });

  it("rejects an inverted quantitative range", () => {
    expect(
      runKeyControlDesignation({
        addressesSignificantRisk: false,
        quantitativeEffect: 1,
        qualitativeRisk: false,
        quantitativeLimit: 10,
        quantitativeThreshold: 20,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_quantitative_thresholds" }] },
      ok: false,
    });
  });
});
