import { describe, expect, it } from "vitest";
import {
  calculateOutputCapacitorEsrLimit,
  outputCapacitorEsrLimitExample,
  runOutputCapacitorEsrLimit,
} from "./tool.js";

describe("ESR Limit For Ripple", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOutputCapacitorEsrLimit(outputCapacitorEsrLimitExample.input),
    ).toEqual({ ok: true, output: outputCapacitorEsrLimitExample.output });
  });

  it("matches the ratio formula on another budget", () => {
    expect(
      calculateOutputCapacitorEsrLimit({
        allowedOutputRippleMv: 33,
        rippleCurrentA: 1.5,
      }).esrLimitMilliohms,
    ).toBe(33 / 1.5);
  });

  it("tightens the limit when the ripple budget shrinks", () => {
    expect(
      calculateOutputCapacitorEsrLimit({
        ...outputCapacitorEsrLimitExample.input,
        allowedOutputRippleMv: 5,
      }).esrLimitMilliohms,
    ).toBe(2.5);
  });

  it("loosens the limit when the ripple current grows", () => {
    expect(
      calculateOutputCapacitorEsrLimit({
        ...outputCapacitorEsrLimitExample.input,
        rippleCurrentA: 10,
      }).esrLimitMilliohms,
    ).toBe(5);
  });

  it("rejects a zero ripple budget", () => {
    expect(
      runOutputCapacitorEsrLimit({
        ...outputCapacitorEsrLimitExample.input,
        allowedOutputRippleMv: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-positive ripple current", () => {
    expect(
      runOutputCapacitorEsrLimit({
        ...outputCapacitorEsrLimitExample.input,
        rippleCurrentA: -2,
      }).ok,
    ).toBe(false);
  });
});
