import { describe, expect, it } from "vitest";
import {
  runSkirtingHeightLookup,
  skirtingHeightLookupExample,
  skirtingHeightLookupTool,
} from "./tool.js";

describe("Skirting Height Lookup", () => {
  it("computes the canonical example", () =>
    expect(runSkirtingHeightLookup(skirtingHeightLookupExample.input)).toEqual({
      ok: true,
      output: { heightMm: 80 },
    }));

  it("looks up the standard height", () =>
    expect(runSkirtingHeightLookup({ styleClass: "standard" })).toEqual({
      ok: true,
      output: { heightMm: 60 },
    }));

  it("looks up the grand height", () =>
    expect(runSkirtingHeightLookup({ styleClass: "grand" })).toEqual({
      ok: true,
      output: { heightMm: 100 },
    }));

  it("covers every documented style class via its map literal", () => {
    for (const styleClass of ["standard", "tall", "grand"] as const) {
      const result = runSkirtingHeightLookup({ styleClass });
      expect(result.ok).toBe(true);
    }
  });

  it("orders heights from standard to grand", () => {
    const heights = ["standard", "tall", "grand"].map((styleClass) => {
      const result = runSkirtingHeightLookup({ styleClass });
      if (!result.ok) throw new Error("expected success");
      return result.output.heightMm;
    });
    expect(heights).toEqual([60, 80, 100]);
  });

  it("rejects unsupported style classes", () => {
    const result = runSkirtingHeightLookup({ styleClass: "medium" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("styleClass");
  });

  it("rejects differently cased style classes", () =>
    expect(runSkirtingHeightLookup({ styleClass: "Standard" }).ok).toBe(false));

  it("requires the style class", () =>
    expect(runSkirtingHeightLookup({}).ok).toBe(false));

  it("rejects non-string style classes", () =>
    expect(runSkirtingHeightLookup({ styleClass: 80 } as never).ok).toBe(
      false,
    ));

  it("rejects unknown input fields", () => {
    const result = runSkirtingHeightLookup({
      material: "mdf",
      styleClass: "tall",
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(skirtingHeightLookupExample))).toEqual(
      skirtingHeightLookupExample,
    );
    expect(skirtingHeightLookupTool.id).toBe(
      "carpentry/sockelleiste-hoehe-60-100mm-lookup",
    );
    expect(skirtingHeightLookupTool.execution).toEqual({ kind: "pure" });
    expect(
      skirtingHeightLookupTool.inputSchema.properties?.styleClass.enum,
    ).toEqual(["standard", "tall", "grand"]);
  });
});
