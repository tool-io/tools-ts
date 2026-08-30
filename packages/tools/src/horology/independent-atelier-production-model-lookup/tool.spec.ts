import { describe, expect, it } from "vitest";
import {
  atelierModelExample,
  lookupIndependentAtelierProductionModel,
  runAtelierModel,
} from "./tool.js";

describe("independent atelier production-model lookup", () => {
  it("reproduces the canonical production-scale statement", () => {
    expect(runAtelierModel(atelierModelExample.input)).toEqual({
      ok: true,
      output: atelierModelExample.output,
    });
  });

  it("separates ownership from workshop scale", () => {
    expect(
      lookupIndependentAtelierProductionModel({ modelFocus: "ownership" })
        .verifiedStatement,
    ).toContain("not workshop size");
  });

  it("requires maker-specific manufacturing-depth evidence", () => {
    expect(
      lookupIndependentAtelierProductionModel({
        modelFocus: "manufacturingDepth",
      }).keyDate,
    ).toBe("maker-specific");
  });

  it("avoids a universal neo-vintage production boundary", () => {
    expect(
      lookupIndependentAtelierProductionModel({ modelFocus: "productionScale" })
        .verifiedStatement,
    ).toContain("no universal piece-count");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runAtelierModel({ modelFocus: "tier" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "modelFocus" }] },
      ok: false,
    });
  });
});
