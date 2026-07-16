import { describe, expect, it } from "vitest";

import bodyMassIndexTool from "../body-mass-index/tool.js";
import { createToolCatalogEntry } from "./catalog.js";

describe("tool catalog metadata", () => {
  it("publishes the supplied implementation date", () => {
    expect(
      createToolCatalogEntry(
        bodyMassIndexTool,
        "test-fingerprint",
        "2026-03-21T09:21:06+01:00",
      ).implementedAt,
    ).toBe("2026-03-21T09:21:06+01:00");
  });

  it("rejects invalid implementation dates", () => {
    expect(() =>
      createToolCatalogEntry(
        bodyMassIndexTool,
        "test-fingerprint",
        "not-a-date",
      ),
    ).toThrow("valid date-time");
  });
});
