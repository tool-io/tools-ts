import { describe, expect, it } from "vitest";
import {
  calculateSiglaStopmarkPositionChecker,
  siglaStopmarkPositionCheckerExample,
  runSiglaStopmarkPositionChecker,
} from "./tool.js";

describe("epigraphy/sigla-stopmark-position-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSiglaStopmarkPositionChecker(
        siglaStopmarkPositionCheckerExample.input,
      ),
    ).toEqual({ ok: true, output: siglaStopmarkPositionCheckerExample.output });
  });

  it("accepts interior interpuncts", () => {
    expect(
      calculateSiglaStopmarkPositionChecker({ text: "M\u00B7TVLLIVS" }),
    ).toEqual({
      tokenCount: 1,
      interpunctTokens: 1,
      interpunctCount: 1,
      invalidTokens: [],
      isValidAll: true,
    });
  });

  it("flags a leading interpunct", () => {
    expect(
      calculateSiglaStopmarkPositionChecker({ text: "\u00B7CIVIS" })
        .invalidTokens,
    ).toEqual(["\u00B7CIVIS"]);
  });

  it("rejects empty input", () => {
    expect(runSiglaStopmarkPositionChecker({ text: "" }).ok).toBe(false);
  });
});
