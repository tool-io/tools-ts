import { describe, expect, expectTypeOf, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "./core/contract.js";
import type { ToolContract } from "./core/definition.js";
import { exampleOutputsMatch } from "./core/example.js";
import * as rosca from "./banking/rosca-rotating-savings-association-cycle-mathematics/tool.js";
import * as bytes from "./binary/bit-string-byte-grouping/tool.js";
import * as area from "./cartography/equal-area-break-generator/tool.js";
import * as jenks from "./cartography/jenks-natural-breaks-simplified/tool.js";
import * as legend from "./cartography/legend-order-sorter-simple/tool.js";
import * as word from "./combinatorics/binary-word-fixed-weight-next/tool.js";
import * as composition from "./combinatorics/weak-composition-next-vector/tool.js";
import * as heart from "./fun/ascii-art-heart/tool.js";
import * as quality from "./genomics/perbase-quality-summary-note-generator/tool.js";
import * as compass from "./geodesy/compass-rule-adjustment-distributor/tool.js";
import * as meridian from "./geodesy/meridian-arc-inverse-solver/tool.js";
import * as molodensky from "./geodesy/molodensky-datum-shift-simplified/tool.js";
import * as transit from "./geodesy/transit-rule-adjustment-distributor/tool.js";
import * as direct from "./geodesy/vincenty-direct-forward-problem/tool.js";
import * as inverse from "./geodesy/vincenty-inverse-distance-bearing/tool.js";
import * as language from "./html/lang-attribute-bcp47-checker/tool.js";
import * as padding from "./polynomial/coefficient-power-padding/tool.js";
import * as shift from "./polynomial/coefficient-power-shift/tool.js";
import * as threshold from "./series/two-point-threshold-time/tool.js";
import * as projection from "./voxel/occupancy-axis-projection/tool.js";

const modules = [
  rosca,
  bytes,
  area,
  jenks,
  legend,
  word,
  composition,
  heart,
  quality,
  compass,
  meridian,
  molodensky,
  transit,
  direct,
  inverse,
  language,
  padding,
  shift,
  threshold,
  projection,
];

// Corrupt every actual leaf, not just the outer result or one happy-path field.
const invalidLeaves = (value: unknown): unknown[] => {
  if (Array.isArray(value))
    return value.flatMap((item, index) =>
      invalidLeaves(item).map((bad) =>
        value.map((v, j) => (j === index ? bad : v)),
      ),
    );
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      invalidLeaves(item).map((bad) => ({ ...value, [key]: bad })),
    );
  }
  return [typeof value === "string" ? {} : "invalid-leaf"];
};

describe("reviewed output contract follow-ups", () => {
  it.each(modules)("closes and enforces $tool.id", ({ tool, example }) => {
    expect(validateToolContract(tool)).toEqual([]);
    const execution = tool.execute(example.input);
    expect(execution.ok).toBe(true);
    if (!execution.ok) throw new Error(`Example execution failed: ${tool.id}`);
    // Use the release validator's 64-EPSILON tolerance for cross-engine math;
    // object keys, arrays and nonnumeric values must still match exactly.
    expect(exampleOutputsMatch(execution.output, example.output)).toBe(true);
    expect(matchesToolJsonSchema(execution.output, tool.outputSchema)).toBe(
      true,
    );
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    const result = tool.outputSchema.properties?.result;
    expect(result?.additionalProperties).toBe(false);
    expect(Object.keys(result?.properties ?? {}).length).toBeGreaterThan(0);
    expect(
      matchesToolJsonSchema(
        { result: { ...example.output.result, unexpected: 1 } },
        tool.outputSchema,
      ),
    ).toBe(false);
    for (const key of result?.required ?? []) {
      const missing = Object.fromEntries(
        Object.entries(example.output.result).filter(([name]) => name !== key),
      );
      expect(
        matchesToolJsonSchema({ result: missing }, tool.outputSchema),
        key,
      ).toBe(false);
    }
    for (const invalid of invalidLeaves(example.output)) {
      expect(matchesToolJsonSchema(invalid, tool.outputSchema)).toBe(false);
    }
  });

  it("preserves concrete types through shared helpers and filled arrays", () => {
    expectTypeOf<rosca.Output["result"]["payoutByRoundMinor"]>().toEqualTypeOf<
      number[]
    >();
    expectTypeOf<bytes.Output["result"]["bytes"]>().toEqualTypeOf<number[]>();
    expectTypeOf<area.Output["result"]["upperBounds"]>().toEqualTypeOf<
      number[]
    >();
    expectTypeOf<jenks.Output["result"]["classStartIndices"]>().toEqualTypeOf<
      number[]
    >();
    expectTypeOf<legend.Output["result"]["orderedItemIds"]>().toEqualTypeOf<
      string[]
    >();
    expectTypeOf<word.Output["result"]["word"]>().toEqualTypeOf<
      string | null
    >();
    expectTypeOf<composition.Output["result"]["vector"]>().toEqualTypeOf<
      number[] | null
    >();
    expectTypeOf<heart.Output["result"]["heartLines"]>().toEqualTypeOf<
      string[]
    >();
    expectTypeOf<quality.Output["result"]["maximum"]>().toEqualTypeOf<number>();
    expectTypeOf<
      compass.Output["result"]["coordinatesEastNorthMeters"]
    >().toEqualTypeOf<number[][]>();
    expectTypeOf<
      transit.Output["result"]["correctionsEastMeters"]
    >().toEqualTypeOf<number[]>();
    expectTypeOf<
      meridian.Output["result"]["converged"]
    >().toEqualTypeOf<boolean>();
    expectTypeOf<
      molodensky.Output["result"]["heightShiftMeters"]
    >().toEqualTypeOf<number>();
    expectTypeOf<
      direct.Output["result"]["finalBearingDegrees"]
    >().toEqualTypeOf<number | null>();
    expectTypeOf<inverse.Output["result"]["distanceMeters"]>().toEqualTypeOf<
      number | null
    >();
    expectTypeOf<
      language.Output["result"]["wellFormedSyntax"]
    >().toEqualTypeOf<boolean>();
    expectTypeOf<padding.Output["result"]["coefficients"]>().toEqualTypeOf<
      number[]
    >();
    expectTypeOf<shift.Output["result"]["coefficients"]>().toEqualTypeOf<
      number[]
    >();
    expectTypeOf<threshold.Output["result"]["crossingTime"]>().toEqualTypeOf<
      number | null
    >();
    expectTypeOf<projection.Output["result"]["projection"]>().toEqualTypeOf<
      number[][]
    >();
  });

  it.each([
    {
      tool: bytes.tool,
      input: { bits: "" },
      expected: { groups: [], bytes: [] },
    },
    { tool: word.tool, input: { word: "" }, expected: { word: null } },
    { tool: word.tool, input: { word: "1100" }, expected: { word: null } },
    {
      tool: composition.tool,
      input: { vector: [0] },
      expected: { vector: null },
    },
    {
      tool: composition.tool,
      input: { vector: [3, 0, 0] },
      expected: { vector: null },
    },
    {
      tool: projection.tool,
      input: { coordinates: [], axis: 0 },
      expected: { projection: [] },
    },
    {
      tool: padding.tool,
      input: { coefficients: [1, 2], degree: 0 },
      expected: { coefficients: [1, 2] },
    },
    {
      tool: shift.tool,
      input: { coefficients: [1, 2], shift: 0 },
      expected: { coefficients: [1, 2] },
    },
    {
      tool: quality.tool,
      input: { qualityScores: [7] },
      expected: { minimum: 7, q1: 7, median: 7, q3: 7, maximum: 7 },
    },
    {
      tool: threshold.tool,
      input: {
        firstTime: 0,
        secondTime: 2,
        firstValue: 4,
        secondValue: 4,
        threshold: 4,
      },
      expected: { crossingTime: null, condition: "entire-plateau" },
    },
    {
      tool: threshold.tool,
      input: {
        firstTime: 0,
        secondTime: 2,
        firstValue: 4,
        secondValue: 4,
        threshold: 3,
      },
      expected: { crossingTime: null, condition: "no-crossing" },
    },
    {
      tool: threshold.tool,
      input: {
        firstTime: 0,
        secondTime: 2,
        firstValue: 0,
        secondValue: 4,
        threshold: 5,
      },
      expected: { crossingTime: null, condition: "outside-segment" },
    },
    {
      tool: threshold.tool,
      input: {
        firstTime: 0,
        secondTime: 2,
        firstValue: 4,
        secondValue: 0,
        threshold: 2,
      },
      expected: { crossingTime: 1, condition: "one-linear-crossing" },
    },
    {
      tool: direct.tool,
      input: { ...direct.example.input, distanceMeters: 0 },
      expected: {
        converged: true,
        iterations: 0,
        latitudeDegrees: 0,
        longitudeDegrees: 0,
        finalBearingDegrees: null,
      },
    },
    {
      tool: inverse.tool,
      input: { ...inverse.example.input, endLongitudeDegrees: 0 },
      expected: {
        converged: true,
        iterations: 0,
        distanceMeters: 0,
        initialBearingDegrees: null,
        finalBearingDegrees: null,
      },
    },
    {
      tool: inverse.tool,
      input: { ...inverse.example.input, endLongitudeDegrees: 180 },
      expected: {
        converged: false,
        iterations: 0,
        distanceMeters: null,
        initialBearingDegrees: null,
        finalBearingDegrees: null,
        reason:
          "Antipodal endpoints have no unique azimuth; no spherical fallback",
      },
    },
    {
      tool: inverse.tool,
      input: {
        ...inverse.example.input,
        semiMajorMeters: 6378137,
        flattening: 1 / 298.257223563,
        endLatitudeDegrees: 0.5,
        endLongitudeDegrees: 179.7,
      },
      expected: {
        converged: false,
        iterations: 200,
        distanceMeters: null,
        initialBearingDegrees: null,
        finalBearingDegrees: null,
        reason: "Vincenty iteration did not converge; no spherical fallback",
      },
    },
    {
      tool: language.tool,
      input: { languageTag: "en--US" },
      expected: { wellFormedSyntax: false, registeredSubtagsVerified: false },
    },
  ])(
    "preserves empty, absent or conditional results: $tool.id ($input)",
    ({ tool, input, expected }) => {
      expect(tool.execute(input)).toEqual({
        ok: true,
        output: { result: expected },
      });
      expect(
        matchesToolJsonSchema({ result: expected }, tool.outputSchema),
      ).toBe(true);
    },
  );

  it("rejects wrong members and dimensions even when example arrays are empty", () => {
    const bad: readonly [ToolContract, unknown][] = [
      [bytes.tool, { groups: [1], bytes: [] }],
      [bytes.tool, { groups: [], bytes: [null] }],
      [composition.tool, { vector: [1, "2"] }],
      [
        rosca.tool,
        {
          ...rosca.example.output.result,
          netCashFlowsByParticipantMinor: [["100"]],
        },
      ],
      [projection.tool, { projection: [[1, 2, 3]] }],
      [projection.tool, { projection: [[1.5, 2]] }],
      [
        compass.tool,
        { ...compass.example.output.result, coordinatesEastNorthMeters: [[0]] },
      ],
      [
        language.tool,
        { wellFormedSyntax: true, registeredSubtagsVerified: true },
      ],
      [inverse.tool, { ...inverse.example.output.result, reason: null }],
      [threshold.tool, { crossingTime: null, condition: "unknown" }],
    ];
    for (const [tool, result] of bad) {
      expect(
        matchesToolJsonSchema({ result }, tool.outputSchema),
        tool.id,
      ).toBe(false);
    }
  });
});
