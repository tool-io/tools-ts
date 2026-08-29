import { describe, expect, it } from "vitest";
import {
  getToolMetadata,
  listTools,
  searchTools,
  toolCatalogFingerprint,
  toolCatalogSize,
} from "./discovery.js";
import { publicToolCount } from "./registry.js";

describe("tool discovery", () => {
  it("publishes a deterministic catalog fingerprint", () => {
    expect(toolCatalogFingerprint).toMatch(/^[0-9a-f]{64}$/);
  });

  it("ranks an exact tool ID first", () => {
    expect(searchTools("body-mass-index", { limit: 3 }).entries[0]?.id).toBe(
      "body-mass-index",
    );
  });

  it("finds tools through human aliases", () => {
    expect(searchTools("what is my ip", { limit: 3 }).entries[0]?.id).toBe(
      "check/my-ip",
    );
  });

  it("filters by execution kind", () => {
    const results = searchTools("ip", {
      executionKinds: ["remote"],
      limit: 10,
    });
    expect(results.entries.length).toBeGreaterThan(0);
    expect(
      results.entries.every((entry) => entry.execution.kind === "remote"),
    ).toBe(true);
  });

  it("returns exact metadata and bounded listings", () => {
    expect(getToolMetadata("body-mass-index")?.title).toBe("Body Mass Index");
    expect(getToolMetadata("missing/tool")).toBeUndefined();
    expect(toolCatalogSize).toBe(publicToolCount);
    expect(toolCatalogSize).toBeGreaterThan(4_000);
    expect(listTools({ limit: 2 })).toMatchObject({
      limit: 2,
      offset: 0,
      total: publicToolCount,
    });
    expect(listTools({ limit: 2 }).entries).toHaveLength(2);
    expect(listTools({ limit: 2, offset: 2 }).entries[0]?.id).not.toBe(
      listTools({ limit: 2 }).entries[0]?.id,
    );
    expect(() => listTools({ limit: 0 })).toThrow(RangeError);
    expect(() => listTools({ offset: -1 })).toThrow(RangeError);
  });
});
