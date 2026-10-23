import { describe, expect, expectTypeOf, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "./core/contract.js";
import type { ToolDefinition } from "./core/definition.js";
import type { ToolExample } from "./core/example.js";
import { createSeededRandom } from "./random/seeded-number/tool.js";
import * as redaction from "./json/json-leaf-value-redaction/tool.js";
import * as selection from "./json/object-key-selection-order/tool.js";
import * as transposer from "./json/record-key-value-transposer/tool.js";
import * as circle from "./random/circle-set/tool.js";
import * as synthetic from "./random/synthetic-division-exercise/tool.js";
import * as trace from "./random/two-level-run-trace/tool.js";
import * as origami from "./random/origami-practice-plan/tool.js";
import * as replay from "./terminal/sgr-normalized-style-replay/tool.js";
import * as spans from "./terminal/sgr-style-span-map/tool.js";
import * as compact from "./zone/offset-span-adjacent-compactor/tool.js";
import * as effective from "./zone/offset-transition-effective-spans/tool.js";
import * as m0 from "./random/acronym-expansion-puzzle/tool.js";
import * as m1 from "./random/angular-size-practice-set/tool.js";
import * as m2 from "./random/checksum-test-corpus/tool.js";
import * as m3 from "./random/circle-set/tool.js";
import * as m4 from "./random/cuboid-set/tool.js";
import * as m5 from "./random/de-morgan-transformation-quiz/tool.js";
import * as m6 from "./random/ellipse-set/tool.js";
import * as m7 from "./random/energy-comparison-scenario/tool.js";
import * as m8 from "./random/enharmonic-spelling-quiz/tool.js";
import * as m9 from "./random/gcd-lcm-exercise/tool.js";
import * as m10 from "./random/graph-degree-density-quiz/tool.js";
import * as m11 from "./random/http-content-negotiation-exercise/tool.js";
import * as m12 from "./random/http-entity-tag-comparison-cards/tool.js";
import * as m13 from "./random/intel-hex-record-test-case/tool.js";
import * as m14 from "./random/ipv4-subnet-exercise/tool.js";
import * as m15 from "./random/ipv6-compression-exercise/tool.js";
import * as m16 from "./random/ipv6-subnet-exercise/tool.js";
import * as m17 from "./random/linear-equation-exercise/tool.js";
import * as m18 from "./random/momentum-impulse-exercise/tool.js";
import * as m19 from "./random/month-boundary-exercise/tool.js";
import * as m20 from "./random/nth-child-pattern-quiz/tool.js";
import * as m21 from "./random/origami-practice-plan/tool.js";
import * as m22 from "./random/parcel-billable-weight-exercise/tool.js";
import * as m23 from "./random/pitch-frequency-matching-quiz/tool.js";
import * as m24 from "./random/polynomial-evaluation-exercise/tool.js";
import * as m25 from "./random/prime-factorization-exercise/tool.js";
import * as m26 from "./random/punctuation-restoration-practice/tool.js";
import * as m27 from "./random/quadratic-equation-exercise/tool.js";
import * as m28 from "./random/rectangle-set/tool.js";
import * as m29 from "./random/regex-literal-escaping-exercise/tool.js";
import * as m30 from "./random/register-bitfield-round-trip-test-case/tool.js";
import * as m31 from "./random/regular-polygon-set/tool.js";
import * as m32 from "./random/right-triangle-exercise/tool.js";
import * as m33 from "./random/run-length-round-trip-test-case/tool.js";
import * as m34 from "./random/scientific-notation-practice-cards/tool.js";
import * as m35 from "./random/spacing-scale/tool.js";
import * as m36 from "./random/stellar-magnitude-comparison-quiz/tool.js";
import * as m37 from "./random/synthetic-division-exercise/tool.js";
import * as m38 from "./random/telescope-setup-practice-cards/tool.js";
import * as m39 from "./random/triangle-set/tool.js";
import * as m40 from "./random/tuning-beat-frequency-exercise/tool.js";
import * as m41 from "./random/two-level-run-trace/tool.js";
import * as m42 from "./random/typography-scale/tool.js";
import * as m43 from "./random/unit-conversion-exercise/tool.js";
import * as m44 from "./random/varint-round-trip-test-case/tool.js";
import * as m45 from "./random/zigzag-round-trip-test-case/tool.js";
import * as m46 from "./terminal/sgr-normalized-style-replay/tool.js";
import * as m47 from "./terminal/sgr-style-span-map/tool.js";
import * as m48 from "./terminal/style-record-run-compactor/tool.js";
import * as m49 from "./tree/parent-record-pruned-node-map/tool.js";
import * as m50 from "./trie/compressed-edge-node-expander/tool.js";
import * as m51 from "./zone/offset-span-adjacent-compactor/tool.js";
import * as m52 from "./zone/offset-transition-effective-spans/tool.js";
const modules: readonly {
  readonly default: ToolDefinition<unknown, unknown>;
  readonly [key: string]: unknown;
}[] = [
  m0,
  m1,
  m2,
  m3,
  m4,
  m5,
  m6,
  m7,
  m8,
  m9,
  m10,
  m11,
  m12,
  m13,
  m14,
  m15,
  m16,
  m17,
  m18,
  m19,
  m20,
  m21,
  m22,
  m23,
  m24,
  m25,
  m26,
  m27,
  m28,
  m29,
  m30,
  m31,
  m32,
  m33,
  m34,
  m35,
  m36,
  m37,
  m38,
  m39,
  m40,
  m41,
  m42,
  m43,
  m44,
  m45,
  m46,
  m47,
  m48,
  m49,
  m50,
  m51,
  m52,
];

describe("selectively reviewed result contracts", () => {
  it.each(modules)("describes guaranteed structure: $default.id", (mod) => {
    const tool = mod.default;
    const example = Object.entries(mod).find(([name]) =>
      /example$/i.test(name),
    )?.[1] as ToolExample<unknown>;
    expect(validateToolContract(tool)).toEqual([]);
    const schema = tool.outputSchema.properties?.result;
    expect(schema?.additionalProperties).toBe(false);
    expect(Object.keys(schema?.properties ?? {})).not.toHaveLength(0);
    for (const random of [
      () => 0,
      () => 0.25,
      () => 0.5,
      () => 0.999999,
      createSeededRandom("reviewed-contract"),
    ]) {
      const execution = tool.execute(example.input, { random });
      expect(execution.ok).toBe(true);
      if (!execution.ok) throw new Error(tool.id);
      expect(matchesToolJsonSchema(execution.output, tool.outputSchema)).toBe(
        true,
      );
      const result = (execution.output as { result: Record<string, unknown> })
        .result;
      expect(
        matchesToolJsonSchema(
          { result: { ...result, unexpected: true } },
          tool.outputSchema,
        ),
      ).toBe(false);
      for (const key of schema?.required ?? []) {
        const missing = Object.fromEntries(
          Object.entries(result).filter(([name]) => name !== key),
        );
        expect(
          matchesToolJsonSchema({ result: missing }, tool.outputSchema),
          key,
        ).toBe(false);
        expect(
          matchesToolJsonSchema(
            { result: { ...result, [key]: null } },
            tool.outputSchema,
          ),
          key,
        ).toBe(false);
      }
    }
  });
  it("retains concrete row types, nullable answers and numeric trace values", () => {
    expectTypeOf<
      circle.RandomCircleSetOutput["circles"][number]["area"]
    >().toEqualTypeOf<number>();
    expectTypeOf<
      synthetic.RandomSyntheticDivisionExerciseOutput["exercises"][number]["answer"]
    >().toEqualTypeOf<
      ReturnType<
        typeof import("./algebra/synthetic-division/tool.js").calculateSyntheticDivision
      >
    >();
    expectTypeOf<trace.Output["result"]["values"]>().toEqualTypeOf<number[]>();
    expectTypeOf<
      origami.Output["result"]["steps"][number]["minutes"]
    >().toEqualTypeOf<number>();
  });
  it("does not change supported terminal colors and rejects malformed style records", () => {
    const output = replay.calculate({
      parameters: [1, 38, 2, 12, 34, 56, 48, 5, 200],
    });
    expect(output.result.style).toMatchObject({
      bold: true,
      foreground: "rgb:12:34:56",
      background: "index:200",
    });
    expect(matchesToolJsonSchema(output, replay.tool.outputSchema)).toBe(true);
    expect(
      matchesToolJsonSchema(
        { result: { style: { ...output.result.style, bold: "true" } } },
        replay.tool.outputSchema,
      ),
    ).toBe(false);
    const empty = spans.calculate({ text: "" });
    expect(empty).toEqual({ result: { spans: [] } });
    expect(matchesToolJsonSchema(empty, spans.tool.outputSchema)).toBe(true);
  });
  it("preserves fractional zone offsets and empty spans", () => {
    for (const output of [
      compact.calculate({ spansJson: "[]" }),
      compact.calculate({
        spansJson: '[{"start":0.25,"end":1.5,"offset":0.5}]',
      }),
    ])
      expect(matchesToolJsonSchema(output, compact.tool.outputSchema)).toBe(
        true,
      );
    const output = effective.calculate({
      transitionsJson: "[]",
      initialOffset: 0.5,
      start: 0.25,
      end: 1.5,
    });
    expect(output.result.spans).toEqual([
      { start: 0.25, end: 1.5, offset: 0.5 },
    ]);
    expect(matchesToolJsonSchema(output, effective.tool.outputSchema)).toBe(
      true,
    );
  });
  it("preserves arbitrary recursive JSON instead of narrowing it to example values", () => {
    const value = {
      nested: [null, false, 2, "x", { deeper: [{ arbitrary: true }] }],
    };
    const redacted = redaction.calculate({
      documentJson: "null",
      paths: [""],
      replacementJson: JSON.stringify(value),
    });
    expect(redacted.result.document).toEqual(value);
    const selected = selection.calculate({
      objectJson: JSON.stringify({ a: value }),
      orderedKeys: ["a"],
    });
    const transposed = transposer.calculate({
      objectJson: JSON.stringify({ a: value }),
    });
    expect(selected.result.entries[0]?.value).toEqual(value);
    expect(transposed.result.entries[0]?.value).toEqual(value);
    for (const [output, tool] of [
      [redacted, redaction.tool],
      [selected, selection.tool],
      [transposed, transposer.tool],
    ] as const)
      expect(matchesToolJsonSchema(output, tool.outputSchema)).toBe(true);
  });
});
