import { describe, expect, it } from "vitest";
import {
  bostromPathwaysExample,
  lookupBostromSuperintelligencePathway,
  runBostromPathways,
} from "./tool.js";

describe("Bostrom paths to superintelligence lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runBostromPathways(bostromPathwaysExample.input)).toEqual({
      ok: true,
      output: bostromPathwaysExample.output,
    });
  });

  it("includes artificial intelligence as a technological path", () => {
    expect(
      lookupBostromSuperintelligencePathway({
        pathway: "artificialIntelligence",
      }).pathwayDefinition,
    ).toContain("machine intelligence");
  });

  it("distinguishes collective networks and organizations", () => {
    expect(
      lookupBostromSuperintelligencePathway({
        pathway: "networksAndOrganizations",
      }).keyLimitation,
    ).toContain("collective");
  });

  it("rejects takeoff speed as though it were a technological path", () => {
    expect(runBostromPathways({ pathway: "fastTakeoff" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "pathway" }] },
      ok: false,
    });
  });
});
