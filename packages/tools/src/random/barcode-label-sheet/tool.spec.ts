import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  barcodeLabelSheetExample as example,
  calculateBarcodeLabelSheet,
} from "./tool.js";

describe("Random Barcode Label Sheet Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateBarcodeLabelSheet(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("has independently valid weighted checksums, unique IDs, and exact grid positions", () => {
    for (const format of ["ean13", "upca"]) {
      const result = tool.execute({
        ...example.input,
        format,
        prefix: "04",
        count: 12,
        columns: 5,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      expect(
        new Set(result.output.labels.map((label) => label.identifier)).size,
      ).toBe(12);
      expect(result.output.grid).toEqual({ columns: 5, rows: 3 });
      result.output.labels.forEach((label, index) => {
        expect(label.identifier).toHaveLength(format === "ean13" ? 13 : 12);
        expect(label.identifier.startsWith("04")).toBe(true);
        const checksum = [...label.identifier]
          .reverse()
          .reduce(
            (sum, digit, i) => sum + Number(digit) * (i % 2 === 0 ? 1 : 3),
            0,
          );
        expect(checksum % 10).toBe(0);
        expect([label.row, label.column]).toEqual([
          Math.floor(index / 5),
          index % 5,
        ]);
        expect(label.barcode.svg).toContain("<svg");
        expect(label.barcode.width).toBeGreaterThan(0);
        expect(label.barcode.height).toBeGreaterThan(0);
      });
    }
  });
  it("preserves a hand-known check digit and explicit prefix population exhaustion/replacement behavior", () => {
    const fixed = { ...example.input, prefix: "400638133393", count: 1 };
    expect(tool.execute(fixed)).toMatchObject({
      ok: true,
      output: {
        labels: [
          {
            dataDigits: "400638133393",
            identifier: "4006381333931",
            checkDigit: "1",
          },
        ],
      },
    });
    expect(tool.execute({ ...fixed, count: 2 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "insufficient_identifiers" }] },
    });
    const repeated = tool.execute({ ...fixed, count: 2, unique: false });
    expect(repeated.ok).toBe(true);
    if (repeated.ok)
      expect(repeated.output.labels[0].identifier).toBe(
        repeated.output.labels[1].identifier,
      );
  });
  it("rejects malformed prefixes, unsupported formats/render options, and resource excess", () => {
    for (const change of [
      { prefix: "bad" },
      { prefix: "4\n" },
      { format: "upca", prefix: "123456789012" },
      { count: 65 },
      { columns: 0 },
      { scale: 0 },
      { heightMillimeters: 101 },
      { format: "code128" },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
