import { describe, expect, it } from "vitest";
import {
  riserBoardThicknessLookupExample,
  riserBoardThicknessLookupTool,
  runRiserBoardThicknessLookup,
} from "./tool.js";

describe("Riser Board Thickness Lookup", () => {
  it("computes the canonical example", () =>
    expect(
      runRiserBoardThicknessLookup(riserBoardThicknessLookupExample.input),
    ).toEqual({ ok: true, output: { thicknessMm: 19 } }));

  it("returns 19 millimeters for plywood", () =>
    expect(runRiserBoardThicknessLookup({ material: "plywood" })).toEqual({
      ok: true,
      output: { thicknessMm: 19 },
    }));

  it("returns 16 millimeters for MDF", () =>
    expect(runRiserBoardThicknessLookup({ material: "mdf" })).toEqual({
      ok: true,
      output: { thicknessMm: 16 },
    }));

  it("returns 19 millimeters for solid wood", () =>
    expect(runRiserBoardThicknessLookup({ material: "solid" })).toEqual({
      ok: true,
      output: { thicknessMm: 19 },
    }));

  it("rejects an unknown material", () => {
    const result = runRiserBoardThicknessLookup({
      material: "steel",
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects a non-string material", () =>
    expect(runRiserBoardThicknessLookup({ material: 19 } as never).ok).toBe(
      false,
    ));

  it("rejects a missing material", () => {
    const result = runRiserBoardThicknessLookup({});
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "invalid_field",
        field: "material",
        message: "Material is invalid.",
      });
  });

  it("rejects unknown input fields", () => {
    const result = runRiserBoardThicknessLookup({
      material: "plywood",
      thicknessMm: 19,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(
      JSON.parse(JSON.stringify(riserBoardThicknessLookupExample)),
    ).toEqual(riserBoardThicknessLookupExample);
    expect(riserBoardThicknessLookupTool.id).toBe(
      "carpentry/treppen-setzstufe-19mm",
    );
    expect(riserBoardThicknessLookupTool.execution).toEqual({ kind: "pure" });
  });
});
