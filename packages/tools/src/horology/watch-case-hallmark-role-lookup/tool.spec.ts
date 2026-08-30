import { describe, expect, it } from "vitest";
import {
  hallmarkRoleExample,
  lookupWatchCaseHallmarkRole,
  runHallmarkRole,
} from "./tool.js";

describe("watch-case hallmark role lookup", () => {
  it("reproduces the canonical symbol-color caution", () => {
    expect(runHallmarkRole(hallmarkRoleExample.input)).toEqual({
      ok: true,
      output: hallmarkRoleExample.output,
    });
  });

  it("covers the current Swiss official hallmark", () => {
    expect(
      lookupWatchCaseHallmarkRole({ hallmarkFocus: "currentSwissOfficial" })
        .verifiedStatement,
    ).toContain("St. Bernard");
  });

  it("covers foreign and domestic watch-case control scope", () => {
    expect(
      lookupWatchCaseHallmarkRole({ hallmarkFocus: "watchCaseScope" })
        .verifiedStatement,
    ).toContain("whether foreign or domestic");
  });

  it("keeps export marks separate from retail-brand proof", () => {
    expect(
      lookupWatchCaseHallmarkRole({ hallmarkFocus: "exportMark" })
        .verifiedStatement,
    ).toContain("do not by themselves prove");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runHallmarkRole({ hallmarkFocus: "gold" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "hallmarkFocus" }] },
      ok: false,
    });
  });
});
