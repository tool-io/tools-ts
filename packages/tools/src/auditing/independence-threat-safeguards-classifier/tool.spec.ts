import { describe, expect, it } from "vitest";
import {
  classifyIndependenceSafeguards,
  independenceSafeguardsExample,
  runIndependenceSafeguards,
} from "./tool.js";

describe("independence threat safeguards classifier", () => {
  it("reproduces its canonical example", () => {
    expect(
      runIndependenceSafeguards(independenceSafeguardsExample.input),
    ).toEqual({
      ok: true,
      output: independenceSafeguardsExample.output,
    });
  });

  it("does not confirm independence without approval", () => {
    expect(
      classifyIndependenceSafeguards({
        implementedSafeguards: ["review"],
        independenceApproved: false,
        requiredSafeguards: ["review"],
      }),
    ).toMatchObject({ independenceConfirmed: false, missingCount: 0 });
  });

  it("confirms independence when approval and safeguards agree", () => {
    expect(
      classifyIndependenceSafeguards({
        implementedSafeguards: [" Review "],
        independenceApproved: true,
        requiredSafeguards: ["review"],
      }).independenceConfirmed,
    ).toBe(true);
  });

  it("rejects a blank safeguard label", () => {
    expect(
      runIndependenceSafeguards({
        implementedSafeguards: [" "],
        independenceApproved: true,
        requiredSafeguards: ["review"],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_safeguard", field: "implementedSafeguards.0" },
        ],
      },
      ok: false,
    });
  });
});
