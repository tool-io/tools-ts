import { describe, expect, it } from "vitest";
import {
  hingeOverlayLookupExample,
  hingeOverlayLookupTool,
  runHingeOverlayLookup,
} from "./tool.js";

describe("Hinge Overlay Type Lookup", () => {
  it("computes the canonical example", () =>
    expect(runHingeOverlayLookup(hingeOverlayLookupExample.input)).toEqual({
      ok: true,
      output: { doorOverlayMm: 18 },
    }));

  it.each([
    ["overlay", 18],
    ["half-overlay", 9],
    ["inset", 0],
  ] as const)("returns %p overlay of %p mm", (mountingType, expected) =>
    expect(runHingeOverlayLookup({ mountingType })).toEqual({
      ok: true,
      output: { doorOverlayMm: expected },
    }),
  );

  it("rejects an unknown mounting type", () => {
    const result = runHingeOverlayLookup({
      mountingType: "blind",
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects a non-string mounting type", () =>
    expect(runHingeOverlayLookup({ mountingType: 18 } as never).ok).toBe(
      false,
    ));

  it("rejects a missing mounting type", () => {
    const result = runHingeOverlayLookup({});
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "invalid_field",
        field: "mountingType",
        message: "Mounting type is invalid.",
      });
  });

  it("rejects unknown input fields", () => {
    const result = runHingeOverlayLookup({
      mountingType: "overlay",
      doorOverlayMm: 9,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(hingeOverlayLookupExample))).toEqual(
      hingeOverlayLookupExample,
    );
    expect(hingeOverlayLookupTool.id).toBe(
      "carpentry/scharnier-eck-mittel-innen-lookup",
    );
    expect(hingeOverlayLookupTool.execution).toEqual({ kind: "pure" });
  });
});
