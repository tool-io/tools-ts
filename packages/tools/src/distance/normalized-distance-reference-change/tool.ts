import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly firstReference: number;
  readonly secondReference: number;
};
export type Output = {
  readonly firstNormalized: number;
  readonly secondNormalized: number;
  readonly change: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    firstReference: { type: "number", exclusiveMinimum: 0 },
    secondReference: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["distance", "firstReference", "secondReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstNormalized: { type: "number" },
    secondNormalized: { type: "number" },
    change: { type: "number" },
  },
  required: ["firstNormalized", "secondNormalized", "change"],
} as const;
/** Rebase an explicit nonnegative distance between two positive normalization references. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, firstReference, secondReference } = request;
  const compute = (): Output => {
    H.domain(distance >= 0, "distance");
    (H.domain(firstReference > 0, "firstReference"), firstReference);
    (H.domain(secondReference > 0, "secondReference"), secondReference);
    return {
      firstNormalized: distance / firstReference,
      secondNormalized: distance / secondReference,
      change: distance / secondReference - distance / firstReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 12, firstReference: 4, secondReference: 6 },
  output: { firstNormalized: 3, secondNormalized: 2, change: -1 },
} satisfies ToolExample<Input, Output>;
export const normalizedDistanceReferenceChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["distance", "mathematics"],
      keywords: ["distance", "mathematics"],
    },
    id: "distance/normalized-distance-reference-change",
    title: "Normalized Distance Reference Change",
    description:
      "Rebase an explicit nonnegative distance between two positive normalization references.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number", minimum: 0 },
        firstReference: { type: "number", exclusiveMinimum: 0 },
        secondReference: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["distance", "firstReference", "secondReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstNormalized: { type: "number" },
        secondNormalized: { type: "number" },
        change: { type: "number" },
      },
      required: ["firstNormalized", "secondNormalized", "change"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstReference",
          label: "First Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondReference",
          label: "Second Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstNormalized",
          label: "First Normalized",
          valueType: { type: "number" },
        },
        {
          id: "secondNormalized",
          label: "Second Normalized",
          valueType: { type: "number" },
        },
        { id: "change", label: "Change", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = normalizedDistanceReferenceChangeTool.execute;
export default normalizedDistanceReferenceChangeTool;
