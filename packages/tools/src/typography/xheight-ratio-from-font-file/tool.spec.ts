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
  it("preserves missing and zero native metrics without fabrication", () => {
    const absent =
      example.input.fontFileHex.slice(0, 56) +
      "5a5a5a5a" +
      example.input.fontFileHex.slice(64);
    const zero =
      example.input.fontFileHex.slice(0, 372) +
      "0000" +
      example.input.fontFileHex.slice(376);
    for (const fontFileHex of [absent, zero])
      close(calculate({ fontFileHex }), {
        unitsPerEm: 1000,
        nativeXHeightUnits: 0,
        xHeightRatio: 0,
        nativeXHeightAvailable: false,
      });
  });
  it("rejects truncated, overlapping and compressed font records", () => {
    const hex = example.input.fontFileHex;
    for (const fontFileHex of [
      hex.slice(0, -2),
      hex.slice(0, 72) + "00000030" + hex.slice(80),
      hex.slice(0, 80) + "00000058" + hex.slice(88),
      "774f4646" + hex.slice(8),
      "0".repeat(1000002),
    ])
      expect(tool.execute({ fontFileHex })).toMatchObject({ ok: false });
  });
  it("computes independent canonical results", () => {
    close(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, example.output);
  });
  it("publishes valid contracts and portable examples", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown inputs", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects malformed and nonfinite fields", () => {
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
      if (Array.isArray(v))
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
    }
  });
  it("rejects invalid domains and unbounded requests", () => {
    const input = { ...example.input, fontFileHex: "00" };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary scenario", () => {
    const input = {
      ...example.input,
      fontFileHex:
        "00010000000200200001000068656164000000000000002c000000364f532f320000000000000064000000600000000000000000000000005f0f3cf5000003e8000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001f40000000000000000",
    };
    close(calculate(input), {
      unitsPerEm: 1000,
      nativeXHeightUnits: 0,
      xHeightRatio: 0,
      nativeXHeightAvailable: false,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        unitsPerEm: 1000,
        nativeXHeightUnits: 0,
        xHeightRatio: 0,
        nativeXHeightAvailable: false,
      });
  });
});
