import { describe, expect, it } from "vitest";
import {
  calculateRepositoryMarcOrgCodeChecker,
  repositoryMarcOrgCodeCheckerExample,
  runRepositoryMarcOrgCodeChecker,
} from "./tool.js";

describe("archival-studies/repository-marc-org-code-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRepositoryMarcOrgCodeChecker(
        repositoryMarcOrgCodeCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: repositoryMarcOrgCodeCheckerExample.output,
    });
  });

  it("accepts plain codes and rejects hyphen misuse and digit-only codes", () => {
    expect(calculateRepositoryMarcOrgCodeChecker({ code: "DLC" }).isValid).toBe(
      true,
    );
    expect(
      calculateRepositoryMarcOrgCodeChecker({ code: "-MH-" }).issues.length,
    ).toBeGreaterThan(0);
    expect(
      calculateRepositoryMarcOrgCodeChecker({ code: "1234" }).isValid,
    ).toBe(false);
  });

  it("rejects codes longer than sixteen characters", () => {
    expect(
      calculateRepositoryMarcOrgCodeChecker({ code: "ABCDEFGHIJKLMNOPQ" })
        .isValid,
    ).toBe(false);
    expect(runRepositoryMarcOrgCodeChecker({ code: "" }).ok).toBe(false);
  });
});
