import { describe, expect, it } from "vitest";
import {
  runSuperlatticeMinibandWidth,
  superlatticeMinibandWidthExample,
} from "./tool.js";

describe("superlattice miniband width", () => {
  it("reproduces the documented tight-binding example", () =>
    expect(
      runSuperlatticeMinibandWidth(superlatticeMinibandWidthExample.input),
    ).toEqual({ ok: true, output: superlatticeMinibandWidthExample.output }));
  it("equals four times coupling at zero barrier width", () =>
    expect(
      runSuperlatticeMinibandWidth({
        barrierWidthNm: 0,
        couplingAtContactMeV: 5,
        decayLengthNm: 1,
      }),
    ).toEqual({ ok: true, output: { minibandWidthMeV: 20 } }));
  it("rejects numerical underflow instead of returning a false zero", () =>
    expect(
      runSuperlatticeMinibandWidth({
        barrierWidthNm: 1000,
        couplingAtContactMeV: 5,
        decayLengthNm: 1,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "result_underflow" }] },
    }));
});
