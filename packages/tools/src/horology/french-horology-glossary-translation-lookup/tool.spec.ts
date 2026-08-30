import { describe, expect, it } from "vitest";
import {
  frenchGlossaryExample,
  lookupFrenchHorologyTerm,
  runFrenchGlossary,
} from "./tool.js";

describe("French horology glossary translation lookup", () => {
  it("reproduces the canonical échappement translation", () => {
    expect(runFrenchGlossary(frenchGlossaryExample.input)).toEqual({
      ok: true,
      output: frenchGlossaryExample.output,
    });
  });

  it("translates balancier as balance wheel", () => {
    expect(
      lookupFrenchHorologyTerm({ termFocus: "balancier" }).englishMeaning,
    ).toBe("balance wheel");
  });

  it("keeps chronometer or stopwatch context", () => {
    expect(
      lookupFrenchHorologyTerm({ termFocus: "chronometre" }).englishMeaning,
    ).toContain("depending on context");
  });

  it("translates spiral as balance spring or hairspring", () => {
    expect(
      lookupFrenchHorologyTerm({ termFocus: "spiral" }).englishMeaning,
    ).toBe("balance spring or hairspring");
  });

  it("rejects an unsupported term at the public boundary", () => {
    expect(runFrenchGlossary({ termFocus: "cadran" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "termFocus" }] },
      ok: false,
    });
  });
});
