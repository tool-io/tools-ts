import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly leftIndex: number;
  readonly rightIndex: number;
  readonly rightSize: number;
};
export type Output = { readonly flatIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftIndex: { type: "integer", minimum: 0 },
    rightIndex: { type: "integer", minimum: 0 },
    rightSize: { type: "integer", minimum: 1 },
  },
  required: ["leftIndex", "rightIndex", "rightSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { flatIndex: { type: "integer" } },
  required: ["flatIndex"],
} as const;
/** Compute list cartesian row flatten index from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { leftIndex, rightIndex, rightSize } = input;
  const compute = (): Output => {
    integer(leftIndex);
    integer(rightSize, 1);
    integer(rightIndex, 0, rightSize - 1);
    return { flatIndex: leftIndex * rightSize + rightIndex };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leftIndex: 2, rightIndex: 3, rightSize: 5 },
  output: { flatIndex: 13 },
} satisfies ToolExample<Input, Output>;
export const listCartesianRowFlattenIndexTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "list/list-cartesian-row-flatten-index",
  title: "List Cartesian Row Flatten Index Tool",
  description:
    "Compute list cartesian row flatten index from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "leftIndex",
        label: "Left Index",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "rightIndex",
        label: "Right Index",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "rightSize",
        label: "Right Size",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "flatIndex", label: "Flat Index", valueType: { type: "integer" } },
    ],
  },
});
export const run = listCartesianRowFlattenIndexTool.execute;
export default listCartesianRowFlattenIndexTool;
