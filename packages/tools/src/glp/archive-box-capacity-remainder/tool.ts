import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordCount: number;
  readonly boxCapacity: number;
};
export type Output = {
  readonly fullBoxes: number;
  readonly remainingRecords: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordCount: { type: "integer", minimum: 0 },
    boxCapacity: { type: "integer", minimum: 1 },
  },
  required: ["recordCount", "boxCapacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullBoxes: { type: "integer" },
    remainingRecords: { type: "integer" },
  },
  required: ["fullBoxes", "remainingRecords"],
} as const;
/** Calculate archive box capacity remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordCount, boxCapacity } = request;
  const compute = (): Output => {
    H.integer(recordCount, 0);
    H.integer(boxCapacity, 1);
    const n = BigInt(recordCount),
      d = BigInt(boxCapacity);
    return { fullBoxes: Number(n / d), remainingRecords: Number(n % d) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordCount: 103, boxCapacity: 24 },
  output: { fullBoxes: 4, remainingRecords: 7 },
} satisfies ToolExample<Input, Output>;
export const archiveBoxCapacityRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/archive-box-capacity-remainder",
    title: "Archive Box Capacity Remainder Tool",
    description:
      "Calculate archive box capacity remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordCount: { type: "integer", minimum: 0 },
        boxCapacity: { type: "integer", minimum: 1 },
      },
      required: ["recordCount", "boxCapacity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullBoxes: { type: "integer" },
        remainingRecords: { type: "integer" },
      },
      required: ["fullBoxes", "remainingRecords"],
    },
    ports: {
      inputs: [
        {
          id: "recordCount",
          label: "Record Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "boxCapacity",
          label: "Box Capacity",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "fullBoxes",
          label: "Full Boxes",
          valueType: { type: "integer" },
        },
        {
          id: "remainingRecords",
          label: "Remaining Records",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = archiveBoxCapacityRemainderTool.execute;
export default archiveBoxCapacityRemainderTool;
