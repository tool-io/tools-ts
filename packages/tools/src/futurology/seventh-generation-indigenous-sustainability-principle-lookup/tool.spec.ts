import { describe, expect, it } from "vitest";
import {
  lookupSeventhGenerationPrinciple,
  runSeventhGeneration,
  seventhGenerationExample,
} from "./tool.js";

describe("seventh-generation sustainability principle lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runSeventhGeneration(seventhGenerationExample.input)).toEqual({
      ok: true,
      output: seventhGenerationExample.output,
    });
  });

  it("looks up reciprocity", () => {
    expect(
      lookupSeventhGenerationPrinciple({ focus: "reciprocity" }).principle,
    ).toContain("reciprocal");
  });

  it("includes consultation caution", () => {
    expect(
      lookupSeventhGenerationPrinciple({ focus: "systemsThinking" })
        .culturalConsultationCaution,
    ).toContain("community-defined priorities");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runSeventhGeneration({ focus: "universal" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "focus" }] },
      ok: false,
    });
  });
});
