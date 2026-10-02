import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly matchingObjects: number };
export type Output = {
  readonly exists: boolean;
  readonly unique: boolean;
  readonly failedUniqueness: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matchingObjects: { type: "integer", minimum: 0 } },
  required: ["matchingObjects"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exists: { type: "boolean" },
    unique: { type: "boolean" },
    failedUniqueness: { type: "boolean" },
  },
  required: ["exists", "unique", "failedUniqueness"],
} as const;
/** Calculate definite description uniqueness count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { matchingObjects } = request;
  const compute = (): Output => {
    H.integer(matchingObjects, 0);
    return {
      exists: matchingObjects > 0,
      unique: matchingObjects === 1,
      failedUniqueness: matchingObjects !== 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { matchingObjects: 1 },
  output: { exists: true, unique: true, failedUniqueness: false },
} satisfies ToolExample<Input, Output>;
export const definiteDescriptionUniquenessCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/definite-description-uniqueness-count",
    title: "Definite Description Uniqueness Count Tool",
    description:
      "Calculate definite description uniqueness count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { matchingObjects: { type: "integer", minimum: 0 } },
      required: ["matchingObjects"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exists: { type: "boolean" },
        unique: { type: "boolean" },
        failedUniqueness: { type: "boolean" },
      },
      required: ["exists", "unique", "failedUniqueness"],
    },
    ports: {
      inputs: [
        {
          id: "matchingObjects",
          label: "Matching Objects",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "exists", label: "Exists", valueType: { type: "boolean" } },
        { id: "unique", label: "Unique", valueType: { type: "boolean" } },
        {
          id: "failedUniqueness",
          label: "Failed Uniqueness",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = definiteDescriptionUniquenessCountTool.execute;
export default definiteDescriptionUniquenessCountTool;
