import { describe, expect, it } from "vitest";
import {
  calculateLifespanVariationEdagger,
  runLifespanVariationEdagger,
  lifespanVariationEdaggerExample,
} from "./tool.js";

describe("demography/lifespan-variation-edagger", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLifespanVariationEdagger(lifespanVariationEdaggerExample.input),
    ).toEqual({
      ok: true,
      output: lifespanVariationEdaggerExample.output,
    });
  });

  it("weights the final open interval by all remaining survivors", () => {
    expect(
      calculateLifespanVariationEdagger({ lx: [10, 8], ex: [1.5, 1] }),
    ).toEqual({
      lifespanVariationEdagger: 2 * 1.5 + 8 * 1,
    });
  });

  it("rejects misaligned or increasing survivorship", () => {
    expect(runLifespanVariationEdagger({ lx: [10, 9], ex: [1] }).ok).toBe(
      false,
    );
    expect(runLifespanVariationEdagger({ lx: [10, 12], ex: [1, 1] }).ok).toBe(
      false,
    );
  });
});
