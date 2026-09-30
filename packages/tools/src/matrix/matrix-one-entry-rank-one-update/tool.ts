import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly entry: number;
  readonly leftFactor: number;
  readonly rightFactor: number;
  readonly weight: number;
};
export type Output = { readonly entry: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entry: { type: "number" },
    leftFactor: { type: "number" },
    rightFactor: { type: "number" },
    weight: { type: "number" },
  },
  required: ["entry", "leftFactor", "rightFactor", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { entry: { type: "number" } },
  required: ["entry"],
} as const;
/** Compute matrix one entry rank one update from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { entry, leftFactor, rightFactor, weight } = input;
  const compute = (): Output => {
    return { entry: entry + weight * leftFactor * rightFactor };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { entry: 2, leftFactor: 3, rightFactor: 4, weight: 0.5 },
  output: { entry: 8 },
} satisfies ToolExample<Input, Output>;
export const matrixOneEntryRankOneUpdateTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-one-entry-rank-one-update",
  title: "Matrix One Entry Rank One Update Tool",
  description:
    "Compute matrix one entry rank one update from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "entry",
        label: "Entry",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "leftFactor",
        label: "Left Factor",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "rightFactor",
        label: "Right Factor",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "weight",
        label: "Weight",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [{ id: "entry", label: "Entry", valueType: { type: "number" } }],
  },
});
export const run = matrixOneEntryRankOneUpdateTool.execute;
export default matrixOneEntryRankOneUpdateTool;
