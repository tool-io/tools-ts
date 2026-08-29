import { describe, expect, it } from "vitest";
import { createMapDocument, mapExample, runMap } from "./index.js";

describe("portable map tool", () => {
  it("creates a point map document from TableData", () => {
    const result = runMap(mapExample.input);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.document.kind).toBe("tool.io/map-document");
      expect(result.output.document.warnings).toEqual([]);
    }
  });

  it("reports missing coordinate fields without rendering", () => {
    const document = createMapDocument(mapExample.input.data, {
      ...mapExample.input.spec,
      encoding: {
        latitude: { field: "missing-latitude" },
        longitude: { field: "longitude" },
      },
    });
    expect(document.warnings[0]?.code).toBe("unknown_field");
  });
});
