import { describe, expect, it } from "vitest";
import {
  calculateCprContraceptivePrevalenceRate,
  runCprContraceptivePrevalenceRate,
  cprContraceptivePrevalenceRateExample,
} from "./tool.js";

describe("demography/cpr-contraceptive-prevalence-rate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCprContraceptivePrevalenceRate(
        cprContraceptivePrevalenceRateExample.input,
      ),
    ).toEqual({
      ok: true,
      output: cprContraceptivePrevalenceRateExample.output,
    });
  });

  it("yields zero prevalence with no users and full prevalence when everyone uses a method", () => {
    expect(
      calculateCprContraceptivePrevalenceRate({
        currentUsers: 0,
        womenOfReproductiveAge: 1000,
      }).contraceptivePrevalenceRatePercent,
    ).toBe(0);
    expect(
      calculateCprContraceptivePrevalenceRate({
        currentUsers: 1000,
        womenOfReproductiveAge: 1000,
      }).contraceptivePrevalenceRatePercent,
    ).toBe(100);
  });

  it("rejects empty bases and users exceeding the base", () => {
    expect(
      runCprContraceptivePrevalenceRate({
        currentUsers: 5,
        womenOfReproductiveAge: 0,
      }).ok,
    ).toBe(false);
    expect(
      runCprContraceptivePrevalenceRate({
        currentUsers: 50,
        womenOfReproductiveAge: 40,
      }).ok,
    ).toBe(false);
  });
});
