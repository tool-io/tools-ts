import { describe, expect, it } from "vitest";
import { isToolSemanticType, toolSemanticTypes } from "./semantic-type.js";

describe("tool semantic types", () => {
  it("publishes unique stable identifiers", () => {
    const values = Object.values(toolSemanticTypes);
    expect(new Set(values).size).toBe(values.length);
    expect(values).toContain("matrix/number");
    expect(values).toContain("document/toolio");
    expect(values).toContain("color/rgb");
  });

  it("rejects arbitrary type strings at runtime", () => {
    expect(isToolSemanticType(toolSemanticTypes.textPlain)).toBe(true);
    expect(isToolSemanticType("text/plian")).toBe(false);
    expect(isToolSemanticType(undefined)).toBe(false);
  });
});
