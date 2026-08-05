import { describe, expect, it } from "vitest";
import {
  convertTemperature,
  runTemperature,
  temperatureExample,
} from "./tool.js";

describe("Convert Temperature", () => {
  it("converts common reference points", () => {
    expect(convertTemperature(0, "C", "F")).toBeCloseTo(32, 12);
    expect(convertTemperature(100, "C", "K")).toBeCloseTo(373.15, 12);
    expect(convertTemperature(491.67, "Ra", "C")).toBeCloseTo(0, 10);
  });
  it("converts historical scales", () => {
    expect(convertTemperature(0, "Re", "C")).toBeCloseTo(0, 12);
    expect(convertTemperature(7.5, "Ro", "C")).toBeCloseTo(0, 12);
    expect(convertTemperature(150, "De", "C")).toBeCloseTo(0, 12);
  });
  it("rejects invalid values and scales", () => {
    expect(convertTemperature(Number.NaN, "C", "F")).toBeNull();
    expect(convertTemperature(1, "bad", "K")).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runTemperature(temperatureExample.input)).toEqual({
      ok: true,
      output: temperatureExample.output,
    }));
});
