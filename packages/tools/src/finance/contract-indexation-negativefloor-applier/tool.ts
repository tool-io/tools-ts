import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly base: number;
  readonly indexChange: number;
  readonly floor: number;
};
export type Output = {
  readonly appliedChange: number;
  readonly adjusted: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base: { type: "number" },
    indexChange: { type: "number" },
    floor: { type: "number" },
  },
  required: ["base", "indexChange", "floor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    appliedChange: { type: "number" },
    adjusted: { type: "number" },
  },
  required: ["appliedChange", "adjusted"],
} as const;
/** Apply an explicit lower floor to an index change before adjusting the contract base. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { base, indexChange, floor } = input;
  const compute = (): Output => {
    const appliedChange = Math.max(floor, indexChange);
    return { appliedChange, adjusted: base * (1 + appliedChange) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { base: 100, indexChange: -0.1, floor: -0.05 },
  output: { appliedChange: -0.05, adjusted: 95 },
} satisfies ToolExample<Input, Output>;
export const contractIndexationNegativefloorApplierTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "finance/contract-indexation-negativefloor-applier",
      title: "Contract Indexation Negativefloor Applier Tool",
      description:
        "Apply an explicit lower floor to an index change before adjusting the contract base.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          base: { type: "number" },
          indexChange: { type: "number" },
          floor: { type: "number" },
        },
        required: ["base", "indexChange", "floor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          appliedChange: { type: "number" },
          adjusted: { type: "number" },
        },
        required: ["appliedChange", "adjusted"],
      },
      ports: {
        inputs: [
          {
            id: "base",
            label: "Base",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "indexChange",
            label: "Index Change",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "floor",
            label: "Floor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "appliedChange",
            label: "Applied Change",
            valueType: { type: "number" },
          },
          { id: "adjusted", label: "Adjusted", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = contractIndexationNegativefloorApplierTool.execute;
export default contractIndexationNegativefloorApplierTool;
