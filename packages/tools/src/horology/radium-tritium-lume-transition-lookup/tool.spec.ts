import { describe, expect, it } from "vitest";
import {
  lookupRadiumTritiumTransition,
  lumeTransitionExample,
  runLumeTransition,
} from "./tool.js";

describe("radium-to-tritium lume transition lookup", () => {
  it("reproduces the canonical approximate transition", () => {
    expect(runLumeTransition(lumeTransitionExample.input)).toEqual({
      ok: true,
      output: lumeTransitionExample.output,
    });
  });

  it("distinguishes radium and tritium materials", () => {
    expect(
      lookupRadiumTritiumTransition({ transitionFocus: "materials" })
        .verifiedStatement,
    ).toContain("zinc sulfide");
  });

  it("preserves the intact-radium safety guidance", () => {
    expect(
      lookupRadiumTritiumTransition({ transitionFocus: "healthHazard" })
        .verifiedStatement,
    ).toContain("should not be dismantled");
  });

  it("does not present 1968 as a universal brand cutoff", () => {
    expect(
      lookupRadiumTritiumTransition({ transitionFocus: "transition" }).keyDate,
    ).toContain("approximately");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runLumeTransition({ transitionFocus: "brand" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "transitionFocus" }] },
      ok: false,
    });
  });
});
