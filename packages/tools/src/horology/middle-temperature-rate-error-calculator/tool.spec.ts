import { describe, expect, it } from "vitest";
import {
  calculateMiddleTemperatureError,
  middleTemperatureErrorExample,
  runMiddleTemperatureError,
} from "./tool.js";

describe("middle-temperature rate-error calculator", () => {
  it("reproduces the canonical gain example", () => {
    expect(
      runMiddleTemperatureError(middleTemperatureErrorExample.input),
    ).toEqual({
      ok: true,
      output: middleTemperatureErrorExample.output,
    });
  });

  it("identifies loss at the middle temperature", () => {
    expect(
      calculateMiddleTemperatureError({
        lowTemperatureCelsius: 0,
        middleTemperatureCelsius: 20,
        highTemperatureCelsius: 40,
        lowRateSecondsPerDay: 0,
        middleRateSecondsPerDay: -2,
        highRateSecondsPerDay: 0,
      }),
    ).toMatchObject({
      middleTemperatureErrorSecondsPerDay: -2,
      profile: "lossAtMiddle",
    });
  });

  it("identifies zero middle-temperature error", () => {
    expect(
      calculateMiddleTemperatureError({
        lowTemperatureCelsius: 0,
        middleTemperatureCelsius: 20,
        highTemperatureCelsius: 40,
        lowRateSecondsPerDay: 0,
        middleRateSecondsPerDay: 5,
        highRateSecondsPerDay: 10,
      }).profile,
    ).toBe("zeroMiddleError");
  });

  it("interpolates for a non-symmetric middle temperature", () => {
    expect(
      calculateMiddleTemperatureError({
        lowTemperatureCelsius: 10,
        middleTemperatureCelsius: 20,
        highTemperatureCelsius: 30,
        lowRateSecondsPerDay: 0,
        middleRateSecondsPerDay: 1,
        highRateSecondsPerDay: 10,
      }).linearMiddleRateSecondsPerDay,
    ).toBe(5);
  });

  it("rejects temperatures that are not strictly ascending", () => {
    expect(
      runMiddleTemperatureError({
        lowTemperatureCelsius: 23,
        middleTemperatureCelsius: 23,
        highTemperatureCelsius: 38,
        lowRateSecondsPerDay: 0,
        middleRateSecondsPerDay: 0,
        highRateSecondsPerDay: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "temperatures_not_ascending", field: "" }] },
      ok: false,
    });
  });
});
