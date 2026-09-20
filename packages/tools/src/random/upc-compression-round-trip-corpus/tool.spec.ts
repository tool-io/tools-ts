import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  upcCompressionRoundTripCorpusExample as example,
  calculateUpcCompressionRoundTripCorpus,
} from "./tool.js";

describe("Random UPC Compression Round-Trip Corpus Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateUpcCompressionRoundTripCorpus(example.input)).toEqual({
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
  it("reproduces the published 042100005264 compression example with controlled draws", () => {
    const draws = [0, 0.55, 0.25, 0.65];
    const result = tool.execute(
      {
        numberSystem: "0",
        manufacturerPrefix: "42100",
        families: ["last-digit-0-2"],
        compressibleCount: 1,
        noncompressibleCount: 0,
      },
      { random: () => draws.shift()! },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            upcA: "042100005264",
            conversion: {
              upcE: "04252614",
              expandedUpcA: "042100005264",
              roundTripVerified: true,
            },
          },
        ],
      },
    });
    expect(draws).toEqual([]);
  });
  it("constructs every family and checks GS1 digits independently", () => {
    for (const family of example.input.families)
      for (const numberSystem of ["0", "1"] as const) {
        const result = tool.execute({
          ...example.input,
          numberSystem,
          families: [family],
          compressibleCount: 16,
          noncompressibleCount: 12,
        });
        expect(result.ok).toBe(true);
        if (!result.ok) continue;
        expect(
          result.output.cases.filter((item) => item.conversion.compressible),
        ).toHaveLength(16);
        for (const item of result.output.cases) {
          const total = [...item.upcA].reduce(
            (sum, value, i) => sum + Number(value) * (i % 2 === 0 ? 3 : 1),
            0,
          );
          expect(total % 10).toBe(0);
          expect(item.upcA.startsWith(numberSystem)).toBe(true);
          if (item.family !== "noncompressible") {
            expect(item.conversion.roundTripVerified).toBe(true);
            const terminal = item.conversion.upcE![6];
            expect(
              family === "last-digit-0-2"
                ? Number(terminal) <= 2
                : family === "last-digit-3"
                  ? terminal === "3"
                  : family === "last-digit-4"
                    ? terminal === "4"
                    : Number(terminal) >= 5,
            ).toBe(true);
          } else
            expect(item.conversion).toEqual({
              compressible: false,
              upcE: null,
              expandedUpcA: null,
              roundTripVerified: null,
            });
        }
      }
  });
  it("rejects incompatible prefixes instead of quietly changing the requested family", () => {
    expect(
      tool.execute({ ...example.input, manufacturerPrefix: "42100" }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "manufacturerPrefix", code: "incompatible_prefix" }],
      },
    });
    for (const change of [
      { compressibleCount: 0, noncompressibleCount: 0 },
      { manufacturerPrefix: "1\n" },
      { families: ["last-digit-4", "last-digit-4"] },
      { numberSystem: "2" },
      { compressibleCount: 65 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
