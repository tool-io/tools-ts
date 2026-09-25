import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerVersion: readonly number[];
  readonly upperVersion: readonly number[];
  readonly lowerInclusive: boolean;
  readonly upperInclusive: boolean;
  readonly lowerSource: string;
  readonly upperSource: string;
};
export type Output = {
  readonly empty: boolean;
  readonly conflictingBounds: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerVersion: { type: "array", maxItems: 256, items: { type: "integer" } },
    upperVersion: { type: "array", maxItems: 256, items: { type: "integer" } },
    lowerInclusive: { type: "boolean" },
    upperInclusive: { type: "boolean" },
    lowerSource: { type: "string", maxLength: 8192 },
    upperSource: { type: "string", maxLength: 8192 },
  },
  required: [
    "lowerVersion",
    "upperVersion",
    "lowerInclusive",
    "upperInclusive",
    "lowerSource",
    "upperSource",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    empty: { type: "boolean" },
    conflictingBounds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["empty", "conflictingBounds"],
} as const;
/** Contradictory bound witness for supplied stable three-integer versions, excluding prerelease and range-expression parsing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    lowerVersion,
    upperVersion,
    lowerInclusive,
    upperInclusive,
    lowerSource,
    upperSource,
  } = request;
  const compute = (): Output => {
    H.domain(
      lowerVersion.length === 3 &&
        upperVersion.length === 3 &&
        lowerVersion.every((x) => x >= 0) &&
        upperVersion.every((x) => x >= 0),
    );
    let c = 0;
    for (let i = 0; i < 3; i++)
      if (lowerVersion[i] !== upperVersion[i]) {
        c = lowerVersion[i] > upperVersion[i] ? 1 : -1;
        break;
      }
    const empty = c > 0 || (c === 0 && !(lowerInclusive && upperInclusive));
    return {
      empty,
      conflictingBounds: empty ? [lowerSource, upperSource] : [],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lowerVersion: [2, 0, 0],
    upperVersion: [1, 9, 9],
    lowerInclusive: true,
    upperInclusive: true,
    lowerSource: "range-A lower",
    upperSource: "range-B upper",
  },
  output: {
    empty: true,
    conflictingBounds: ["range-A lower", "range-B upper"],
  },
} satisfies ToolExample<Input, Output>;
export const semverRangeEmptyIntersectionWitnessTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "development/semver-range-empty-intersection-witness",
      title: "SemVer Range Empty Intersection Witness Tool",
      description:
        "Contradictory bound witness for supplied stable three-integer versions, excluding prerelease and range-expression parsing.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowerVersion: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          upperVersion: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          lowerInclusive: { type: "boolean" },
          upperInclusive: { type: "boolean" },
          lowerSource: { type: "string", maxLength: 8192 },
          upperSource: { type: "string", maxLength: 8192 },
        },
        required: [
          "lowerVersion",
          "upperVersion",
          "lowerInclusive",
          "upperInclusive",
          "lowerSource",
          "upperSource",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          empty: { type: "boolean" },
          conflictingBounds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["empty", "conflictingBounds"],
      },
      ports: {
        inputs: [
          {
            id: "lowerVersion",
            label: "Lower Version",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "upperVersion",
            label: "Upper Version",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "lowerInclusive",
            label: "Lower Inclusive",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "upperInclusive",
            label: "Upper Inclusive",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "lowerSource",
            label: "Lower Source",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "upperSource",
            label: "Upper Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "empty", label: "Empty", valueType: { type: "boolean" } },
          {
            id: "conflictingBounds",
            label: "Conflicting Bounds",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = semverRangeEmptyIntersectionWitnessTool.execute;
export default semverRangeEmptyIntersectionWitnessTool;
