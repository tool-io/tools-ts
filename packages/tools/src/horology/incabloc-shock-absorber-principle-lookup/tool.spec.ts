import { describe, expect, it } from "vitest";
import {
  incablocPrincipleExample,
  lookupIncablocShockPrinciple,
  runIncablocPrinciple,
} from "./tool.js";

describe("Incabloc shock-absorber principle lookup", () => {
  it("reproduces the canonical double-cone statement", () => {
    expect(runIncablocPrinciple(incablocPrincipleExample.input)).toEqual({
      ok: true,
      output: incablocPrincipleExample.output,
    });
  });

  it("covers the official development history", () => {
    expect(
      lookupIncablocShockPrinciple({ principleFocus: "history" }).keyDate,
    ).toBe("1928–1938");
  });

  it("covers the lyre-spring return function", () => {
    expect(
      lookupIncablocShockPrinciple({ principleFocus: "lyreSpring" })
        .verifiedStatement,
    ).toContain("positioning and returning");
  });

  it("covers the two-phase shock response", () => {
    expect(
      lookupIncablocShockPrinciple({ principleFocus: "shockCycle" })
        .verifiedStatement,
    ).toContain("two-phase");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runIncablocPrinciple({ principleFocus: "kif" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "principleFocus" }] },
      ok: false,
    });
  });
});
