import { describe, expect, it } from "vitest";
import {
  iso6425Example,
  lookupIso6425DivingIndicator,
  runIso6425,
} from "./tool.js";

describe("ISO 6425 diving-time indicator lookup", () => {
  it("reproduces the canonical one-minute resolution requirement", () => {
    expect(runIso6425(iso6425Example.input)).toEqual({
      ok: true,
      output: iso6425Example.output,
    });
  });

  it("requires five-minute analogue markings", () => {
    expect(
      lookupIso6425DivingIndicator({ requirementFocus: "analogueMarkings" })
        .verifiedStatement,
    ).toContain("every five minutes");
  });

  it("requires protection against inadvertent handling", () => {
    expect(
      lookupIso6425DivingIndicator({ requirementFocus: "handlingProtection" })
        .verifiedStatement,
    ).toContain("inadvertent handling");
  });

  it("separates bezel design from certification", () => {
    expect(
      lookupIso6425DivingIndicator({ requirementFocus: "unidirectionalBezel" })
        .verifiedStatement,
    ).toContain("rather than appearance alone");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runIso6425({ requirementFocus: "depthRating" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "requirementFocus" }] },
      ok: false,
    });
  });
});
