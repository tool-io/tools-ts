import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateSeededUuid,
  seededUuidExample,
  seededUuidTool,
} from "./tool.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("Seeded UUID Generator", () => {
  it("publishes a valid pure tool contract", () => {
    expect(seededUuidTool.id).toBe("generate/seeded-uuid");
    expect(validateToolContract(seededUuidTool)).toEqual([]);
  });

  it("executes its canonical example successfully and structurally valid", () => {
    const result = seededUuidTool.execute(seededUuidExample.input);
    expect(result.ok).toBe(true);
    if (result.ok) {
      // The exact strings are pinned after generation; structure is stable.
      for (const id of result.output.identifiers)
        expect(id).toMatch(UUID_PATTERN);
    }
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });

  it("is reproducible for a fixed seed", () => {
    const first = calculateSeededUuid({ count: 5, seed: 7 });
    const second = calculateSeededUuid({ count: 5, seed: 7 });
    expect(first).toEqual(second);
    if (first.ok) {
      expect(new Set(first.output.identifiers).size).toBe(5);
      for (const id of first.output.identifiers)
        expect(id).toMatch(UUID_PATTERN);
    }
  });

  it("honors the injected context randomness", () => {
    let calls = 0;
    const deterministic = (): number => {
      calls += 1;
      return (calls % 16) / 16;
    };
    const result = calculateSeededUuid(
      { count: 1 },
      { random: deterministic },
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      // 8 + 4 + 3 + 1 variant + 3 + 12 = 31 random draws per identifier.
      expect(calls).toBe(31);
      expect(result.output.identifiers[0]).toMatch(UUID_PATTERN);
    }
  });

  it("rejects malformed probes", () => {
    expect(calculateSeededUuid(null).ok).toBe(false);
    expect(calculateSeededUuid({ count: 0 })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateSeededUuid({ count: 101 })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateSeededUuid({ seed: 1.5 })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateSeededUuid({ extra: true })).toMatchObject({
      error: { code: "invalid_input" },
    });
  });
});
