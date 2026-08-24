import { describe, expect, it } from "vitest";
import {
  calculateInterveningOpportunities,
  interveningOpportunitiesStoufferIndexExample,
  interveningOpportunitiesStoufferIndexTool,
  runInterveningOpportunitiesStoufferIndex,
} from "./tool.js";

describe("interveningOpportunitiesStoufferIndexTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runInterveningOpportunitiesStoufferIndex(
        interveningOpportunitiesStoufferIndexExample.input,
      ),
    ).toEqual({
      ok: true,
      output: interveningOpportunitiesStoufferIndexExample.output,
    });
  });

  it("uses destination opportunities over cumulative intervening opportunities", () => {
    expect(
      calculateInterveningOpportunities({
        destinationOpportunities: 300,
        interveningOpportunities: 1200,
      }),
    ).toEqual({ opportunityRatio: 0.25 });
    const result = runInterveningOpportunitiesStoufferIndex({
      destinationOpportunities: 300,
      interveningOpportunities: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("interveningOpportunities");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(interveningOpportunitiesStoufferIndexExample)),
    ).toEqual(interveningOpportunitiesStoufferIndexExample);
    expect(interveningOpportunitiesStoufferIndexTool.contractVersion).toBe(1);
    expect(interveningOpportunitiesStoufferIndexTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("labels the output as an access-ratio heuristic, not the Stouffer index", () => {
    expect(interveningOpportunitiesStoufferIndexTool.title).toContain(
      "Access Ratio",
    );
    expect(interveningOpportunitiesStoufferIndexTool.description).toMatch(
      /not the cumulative Stouffer formulation/,
    );
  });

  it("returns structured errors for malformed input", () => {
    expect(runInterveningOpportunitiesStoufferIndex(null).ok).toBe(false);
    expect(
      runInterveningOpportunitiesStoufferIndex({
        ...interveningOpportunitiesStoufferIndexExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
