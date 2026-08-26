import { describe, expect, it } from "vitest";
import {
  laminateClassLookupExample,
  laminateClassLookupTool,
  runLaminateClassLookup,
} from "./tool.js";

describe("Laminate Class Lookup", () => {
  it("computes the canonical example", () =>
    expect(runLaminateClassLookup(laminateClassLookupExample.input)).toEqual({
      ok: true,
      output: { acRating: "AC4", maxCommercialYears: 4 },
    }));

  it("looks up class 31", () =>
    expect(runLaminateClassLookup({ usageClass: "31" })).toEqual({
      ok: true,
      output: { acRating: "AC3", maxCommercialYears: 2 },
    }));

  it("looks up class 33", () =>
    expect(runLaminateClassLookup({ usageClass: "33" })).toEqual({
      ok: true,
      output: { acRating: "AC5", maxCommercialYears: 6 },
    }));

  it("covers every documented usage class via its map literal", () => {
    for (const usageClass of ["31", "32", "33"] as const) {
      const result = runLaminateClassLookup({ usageClass });
      expect(result.ok).toBe(true);
    }
  });

  it("ranks service years with the AC rating", () => {
    const years = ["31", "32", "33"].map((usageClass) => {
      const result = runLaminateClassLookup({ usageClass });
      if (!result.ok) throw new Error("expected success");
      return result.output.maxCommercialYears;
    });
    expect(years).toEqual([2, 4, 6]);
  });

  it("rejects unsupported usage classes", () => {
    const result = runLaminateClassLookup({ usageClass: "34" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("usageClass");
  });

  it("rejects numeric usage classes", () =>
    expect(runLaminateClassLookup({ usageClass: 32 } as never).ok).toBe(false));

  it("requires the usage class", () =>
    expect(runLaminateClassLookup({}).ok).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runLaminateClassLookup({
      room: "office",
      usageClass: "32",
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(laminateClassLookupExample))).toEqual(
      laminateClassLookupExample,
    );
    expect(laminateClassLookupTool.id).toBe(
      "carpentry/laminat-klasse-31-32-33-lookup",
    );
    expect(laminateClassLookupTool.execution).toEqual({ kind: "pure" });
    expect(
      laminateClassLookupTool.inputSchema.properties?.usageClass.enum,
    ).toEqual(["31", "32", "33"]);
  });
});
