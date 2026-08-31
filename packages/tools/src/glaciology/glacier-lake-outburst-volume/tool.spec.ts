import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
const close = (actual: unknown, expected: unknown): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(expected)) * 1e-8,
    );
  } else if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expect((actual as unknown[]).length).toBe(expected.length);
    expected.forEach((v, i) => close((actual as unknown[])[i], v));
  } else if (expected !== null && typeof expected === "object") {
    expect(Object.keys(actual as object).sort()).toEqual(
      Object.keys(expected).sort(),
    );
    for (const [k, v] of Object.entries(expected))
      close((actual as Record<string, unknown>)[k], v);
  } else expect(actual).toEqual(expected);
};
describe(tool.id, () => {
  it("integrates partial contour intervals and retains a lake rise as negative released volume", () => {
    close(
      calculate({
        ...example.input,
        initialWaterDepthM: 5,
        finalWaterDepthM: 15,
      }),
      {
        initialLakeStorageM3: 62.5,
        finalLakeStorageM3: 562.5,
        signedOutburstReleasedVolumeM3: -500,
      },
    );
    expect(
      calculate({
        ...example.input,
        initialWaterDepthM: 0,
        finalWaterDepthM: 0,
      }).initialLakeStorageM3,
    ).toBe(0);
  });
  it("computes independent canonical values", () => {
    close(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, example.output);
  });
  it("publishes valid contracts and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects mistyped, nonfinite and sparse evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
      }
      if (Array.isArray(v)) {
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
        expect(tool.execute({ ...example.input, [k]: Array(1) })).toMatchObject(
          { ok: false },
        );
      }
    }
  });
  it("is deterministic and preserves evidence", () => {
    const input = JSON.parse(
        JSON.stringify(example.input),
      ) as typeof example.input,
      before = JSON.stringify(input);
    close(calculate(input), example.output);
    close(calculate(input), example.output);
    expect(JSON.stringify(input)).toBe(before);
  });
  it("rejects invalid domains", () => {
    const input = { ...example.input, initialWaterDepthM: 21 };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = { ...example.input, finalWaterDepthM: 15 };
    close(calculate(input), {
      initialLakeStorageM3: 562.5,
      finalLakeStorageM3: 562.5,
      signedOutburstReleasedVolumeM3: 0,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        initialLakeStorageM3: 562.5,
        finalLakeStorageM3: 562.5,
        signedOutburstReleasedVolumeM3: 0,
      });
  });
});
