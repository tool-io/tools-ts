import { describe, expect, it } from "vitest";
import {
  lookupTechnologyReadinessLevel,
  runTrlLookup,
  trlLookupExample,
} from "./tool.js";

describe("technology readiness level lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runTrlLookup(trlLookupExample.input)).toEqual({
      ok: true,
      output: trlLookupExample.output,
    });
  });

  it("looks up level one", () => {
    expect(
      lookupTechnologyReadinessLevel({ technologyReadinessLevel: 1 }),
    ).toMatchObject({ stage: "research", technologyReadinessLevel: 1 });
  });

  it("looks up level nine", () => {
    expect(
      lookupTechnologyReadinessLevel({ technologyReadinessLevel: 9 }).stage,
    ).toBe("proven");
  });

  it("rejects a level outside one through nine", () => {
    expect(runTrlLookup({ technologyReadinessLevel: 10 })).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "technologyReadinessLevel",
          },
        ],
      },
      ok: false,
    });
  });
});
