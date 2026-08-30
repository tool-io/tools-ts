import { describe, expect, it } from "vitest";
import {
  asilomarCategoryExample,
  lookupAsilomarPrincipleCategory,
  runAsilomarCategory,
} from "./tool.js";

describe("Asilomar AI Principles category lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runAsilomarCategory(asilomarCategoryExample.input)).toEqual({
      ok: true,
      output: asilomarCategoryExample.output,
    });
  });

  it("accounts for all 23 principles across three categories", () => {
    const total = (
      ["researchIssues", "ethicsAndValues", "longerTermIssues"] as const
    ).reduce(
      (sum, category) =>
        sum + lookupAsilomarPrincipleCategory({ category }).principleCount,
      0,
    );
    expect(total).toBe(23);
  });

  it("keeps Common Good in longer-term issues", () => {
    expect(
      lookupAsilomarPrincipleCategory({
        category: "longerTermIssues",
      }).principleNames,
    ).toContain("Common Good");
  });
});
