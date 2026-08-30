import { describe, expect, it } from "vitest";
import {
  afrofuturismLookupExample,
  lookupAfrofuturismCulturalImagination,
  runAfrofuturismLookup,
} from "./tool.js";

describe("Afrofuturism cultural technology imagination lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runAfrofuturismLookup(afrofuturismLookupExample.input)).toEqual({
      ok: true,
      output: afrofuturismLookupExample.output,
    });
  });

  it("looks up community prompts", () => {
    expect(
      lookupAfrofuturismCulturalImagination({ theme: "community" })
        .imaginationPrompts[0],
    ).toContain("community practice");
  });

  it("looks up ecology cautions", () => {
    expect(
      lookupAfrofuturismCulturalImagination({ theme: "ecology" })
        .culturalCaution,
    ).toContain("most affected");
  });

  it("rejects an unsupported theme at the public boundary", () => {
    expect(runAfrofuturismLookup({ theme: "futurism" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "theme" }] },
      ok: false,
    });
  });
});
