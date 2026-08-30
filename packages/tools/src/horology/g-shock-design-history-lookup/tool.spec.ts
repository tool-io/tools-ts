import { describe, expect, it } from "vitest";
import {
  gshockPhilosophyExample,
  lookupGshockPhilosophy,
  runGshockPhilosophy,
} from "./tool.js";

describe("G-SHOCK Go Everywhere Do All philosophy lookup", () => {
  it("reproduces the canonical break-resistant origin phrase", () => {
    expect(runGshockPhilosophy(gshockPhilosophyExample.input)).toEqual({
      ok: true,
      output: gshockPhilosophyExample.output,
    });
  });

  it("covers the shock-resistance mission", () => {
    expect(
      lookupGshockPhilosophy({ philosophyFocus: "shockResistance" })
        .verifiedStatement,
    ).toContain("withstand dropping");
  });

  it("covers the full-metal evolution", () => {
    expect(
      lookupGshockPhilosophy({ philosophyFocus: "fullMetalEvolution" }).keyDate,
    ).toBe("GMW-B5000 lineage");
  });

  it("rejects the unverified slogan as an official quotation", () => {
    expect(
      lookupGshockPhilosophy({ philosophyFocus: "terminologyCaution" })
        .verifiedStatement,
    ).toContain("does not present");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runGshockPhilosophy({ philosophyFocus: "MRG" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "philosophyFocus" }] },
      ok: false,
    });
  });
});
