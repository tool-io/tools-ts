import { describe, expect, it } from "vitest";
import {
  lookupMorphologicalFreedomPrinciple,
  morphologicalFreedomExample,
  runMorphologicalFreedom,
} from "./tool.js";

describe("morphological freedom principle lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runMorphologicalFreedom(morphologicalFreedomExample.input)).toEqual({
      ok: true,
      output: morphologicalFreedomExample.output,
    });
  });

  it("looks up autonomy", () => {
    expect(
      lookupMorphologicalFreedomPrinciple({ principle: "autonomy" })
        .testQuestion,
    ).toContain("consent");
  });

  it("looks up access", () => {
    expect(
      lookupMorphologicalFreedomPrinciple({ principle: "access" })
        .principleText,
    ).toContain("wealth");
  });

  it("rejects an unsupported principle at the public boundary", () => {
    expect(runMorphologicalFreedom({ principle: "enhancement" })).toMatchObject(
      {
        error: { issues: [{ code: "invalid_field", field: "principle" }] },
        ok: false,
      },
    );
  });
});
