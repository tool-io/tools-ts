import { describe, expect, it } from "vitest";
import {
  calculateCensorialIterationDecoder,
  censorialIterationDecoderExample,
  runCensorialIterationDecoder,
} from "./tool.js";

describe("epigraphy/censorial-iteration-decoder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCensorialIterationDecoder(censorialIterationDecoderExample.input),
    ).toEqual({ ok: true, output: censorialIterationDecoderExample.output });
  });

  it("reads interpunct-separated markers and arabic numerals", () => {
    expect(
      calculateCensorialIterationDecoder({
        text: "TI·CLAVDIVS·CAESAR·AVG·CENS·IIII",
      }).marker,
    ).toBe("CENS IIII");
    expect(
      calculateCensorialIterationDecoder({ text: "cens. 4" }).iterationCount,
    ).toBe(4);
  });

  it("rejects texts without a censorial marker", () => {
    expect(runCensorialIterationDecoder({ text: "TR POT VI COS XI" }).ok).toBe(
      false,
    );
    expect(runCensorialIterationDecoder({ text: "" }).ok).toBe(false);
  });
});
