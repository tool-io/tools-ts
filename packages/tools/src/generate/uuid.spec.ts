import { describe, expect, it } from "vitest";
import { calculateUuidV4 } from "./uuid-v4/tool.js";
import { calculateUuidV7 } from "./uuid-v7/tool.js";
import { calculateUuidV2 } from "./uuid-v2/tool.js";
import { calculateUuidV8 } from "./uuid-v8/tool.js";
import { calculateNameBasedUuid } from "../uuid/name-based.js";
import { calculateTimeBasedUuid } from "../uuid/time-based.js";
import { md5, sha1 } from "@noble/hashes/legacy.js";
import { loadToolModule } from "../registry.js";

describe("UUID generators", () => {
  it("sets RFC variant and version bits for UUID v4", () => {
    const result = calculateUuidV4({ count: 2, seed: 42 });
    expect(result.ok && result.output.identifiers).toEqual([
      "9972daab-2c86-459f-9d78-3fe1be4e3280",
      "ff46870f-10be-4b0f-a130-42daef0e7445",
    ]);
  });

  it("uses injected randomness when no UUID v4 seed is supplied", () => {
    expect(calculateUuidV4({}, { random: () => 0 })).toEqual({
      ok: true,
      output: { identifiers: ["00000000-0000-4000-8000-000000000000"] },
    });
  });

  it("embeds the 48-bit millisecond timestamp in UUID v7", () => {
    const result = calculateUuidV7({ seed: 42, timestamp: 1_700_000_000_000 });
    expect(result.ok && result.output.identifiers[0]).toBe(
      "018bcfe5-6800-759f-9d78-3fe1be4e3280",
    );
  });

  it("uses the injected clock and randomness for UUID v7 defaults", () => {
    expect(calculateUuidV7({}, { now: () => 0, random: () => 0 })).toEqual({
      ok: true,
      output: { identifiers: ["00000000-0000-7000-8000-000000000000"] },
    });
  });
});

describe("all UUID versions", () => {
  it("publishes matching examples for each new UUID generator", async () => {
    const ids = [
      "generate/uuid-v1",
      "generate/uuid-v2",
      "generate/uuid-v3",
      "generate/uuid-v5",
      "generate/uuid-v6",
      "generate/uuid-v8",
      "generate/uuid-nil",
      "generate/uuid-max",
    ] as const;
    const modules = await Promise.all(
      ids.map(async (id) => [id, await loadToolModule(id)] as const),
    );

    for (const [id, module] of modules) {
      expect(module, id).toBeDefined();
      expect(module!.default.execute(module!.example!.input), id).toEqual({
        ok: true,
        output: module!.example!.output,
      });
    }
  }, 15_000);

  it("sets versions 1 through 8 and the RFC variant", () => {
    const generated = [
      calculateTimeBasedUuid(
        {
          clockSequence: 1,
          count: 1,
          node: "aabbccddeeff",
          timestamp: 1_700_000_000_000,
        },
        1,
      ),
      calculateUuidV2({
        clockSequence: 1,
        localDomain: 0,
        localIdentifier: 1000,
        node: "aabbccddeeff",
        timestamp: 1_700_000_000_000,
      }),
      calculateNameBasedUuid(
        { name: "tool.io", namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8" },
        md5,
        3,
      ),
      calculateUuidV4({ count: 1, seed: 42 }),
      calculateNameBasedUuid(
        { name: "tool.io", namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8" },
        sha1,
        5,
      ),
      calculateTimeBasedUuid(
        {
          clockSequence: 1,
          count: 1,
          node: "aabbccddeeff",
          timestamp: 1_700_000_000_000,
        },
        6,
      ),
      calculateUuidV7({ count: 1, seed: 42, timestamp: 1_700_000_000_000 }),
      calculateUuidV8({ count: 1, seed: 42 }),
    ];
    generated.forEach((result, index) => {
      expect(result.ok, `UUID v${index + 1}`).toBe(true);
      if (!result.ok) return;
      const output = result.output as {
        identifier?: string;
        identifiers?: readonly string[];
      };
      const identifier = output.identifier ?? output.identifiers?.[0] ?? "";
      expect(identifier[14]).toBe(String(index + 1));
      expect(["8", "9", "a", "b"]).toContain(identifier[19]);
    });
  });

  it("rejects timestamps that overflow the UUID Gregorian timestamp field", () => {
    const timestamp = 103_072_857_660_685;
    expect(calculateTimeBasedUuid({ timestamp }, 1)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "timestamp_invalid" }] },
    });
    expect(
      calculateUuidV2({
        localDomain: 0,
        localIdentifier: 1,
        timestamp,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "timestamp_invalid" }] },
    });
  });
});
