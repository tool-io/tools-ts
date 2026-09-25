import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packageLength: number;
  readonly usedSegments: number;
  readonly lengthPerSegment: number;
  readonly discardedLength: number;
};
export type Output = {
  readonly remaining: number;
  readonly completeSegments: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packageLength: { type: "number", minimum: 0 },
    usedSegments: { type: "integer", minimum: 0 },
    lengthPerSegment: { type: "number", exclusiveMinimum: 0 },
    discardedLength: { type: "number", minimum: 0 },
  },
  required: [
    "packageLength",
    "usedSegments",
    "lengthPerSegment",
    "discardedLength",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "number" },
    completeSegments: { type: "integer" },
  },
  required: ["remaining", "completeSegments"],
} as const;
/** Supplied consumable inventory arithmetic; no care technique or use frequency is prescribed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packageLength, usedSegments, lengthPerSegment, discardedLength } =
    request;
  const compute = (): Output => {
    H.integer(usedSegments, 0);
    H.positive(lengthPerSegment);
    H.domain(
      packageLength >= 0 &&
        discardedLength >= 0 &&
        usedSegments * lengthPerSegment + discardedLength <= packageLength,
    );
    return {
      remaining:
        packageLength - usedSegments * lengthPerSegment - discardedLength,
      completeSegments: Math.floor(
        (packageLength - usedSegments * lengthPerSegment - discardedLength) /
          lengthPerSegment,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    packageLength: 50,
    usedSegments: 10,
    lengthPerSegment: 0.4,
    discardedLength: 2,
  },
  output: { remaining: 44, completeSegments: 110 },
} satisfies ToolExample<Input, Output>;
export const flossUseUnitLengthBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dental-hygiene/floss-use-unit-length-budget",
    title: "Floss Use Unit Length Budget Tool",
    description:
      "Supplied consumable inventory arithmetic; no care technique or use frequency is prescribed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packageLength: { type: "number", minimum: 0 },
        usedSegments: { type: "integer", minimum: 0 },
        lengthPerSegment: { type: "number", exclusiveMinimum: 0 },
        discardedLength: { type: "number", minimum: 0 },
      },
      required: [
        "packageLength",
        "usedSegments",
        "lengthPerSegment",
        "discardedLength",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "number" },
        completeSegments: { type: "integer" },
      },
      required: ["remaining", "completeSegments"],
    },
    ports: {
      inputs: [
        {
          id: "packageLength",
          label: "Package Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "usedSegments",
          label: "Used Segments",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lengthPerSegment",
          label: "Length Per Segment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discardedLength",
          label: "Discarded Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        {
          id: "completeSegments",
          label: "Complete Segments",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = flossUseUnitLengthBudgetTool.execute;
export default flossUseUnitLengthBudgetTool;
