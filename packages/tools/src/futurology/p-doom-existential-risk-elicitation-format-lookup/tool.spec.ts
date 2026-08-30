import { describe, expect, it } from "vitest";
import {
  buildPDoomElicitationFormat,
  pDoomElicitationExample,
  runPDoomElicitation,
} from "./tool.js";

describe("P/Doom existential risk elicitation format", () => {
  it("reproduces its canonical example", () => {
    expect(runPDoomElicitation(pDoomElicitationExample.input)).toEqual({
      ok: true,
      output: pDoomElicitationExample.output,
    });
  });

  it("returns eight elicitation prompts", () => {
    expect(
      buildPDoomElicitationFormat({
        riskPathway: "Pathway",
        riskTimeHorizon: "Horizon",
      }).elicitationPrompts,
    ).toHaveLength(8);
  });

  it("trims pathway and horizon", () => {
    expect(
      buildPDoomElicitationFormat({
        riskPathway: " Pathway ",
        riskTimeHorizon: " Horizon ",
      }),
    ).toMatchObject({ riskPathway: "Pathway", riskTimeHorizon: "Horizon" });
  });

  it("rejects an empty risk pathway", () => {
    expect(
      runPDoomElicitation({ riskPathway: " ", riskTimeHorizon: "Horizon" }),
    ).toMatchObject({
      error: {
        issues: [{ code: "risk_description_required", field: "riskPathway" }],
      },
      ok: false,
    });
  });
});
