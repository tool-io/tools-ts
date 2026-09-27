import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leafIndex: number;
  readonly leavesPerBifolium: number;
};
export type Output = { readonly bifoliumIndex: number; readonly slot: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leafIndex: { type: "integer", minimum: 0 },
    leavesPerBifolium: { type: "integer", minimum: 1 },
  },
  required: ["leafIndex", "leavesPerBifolium"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bifoliumIndex: { type: "integer" }, slot: { type: "integer" } },
  required: ["bifoliumIndex", "slot"],
} as const;
/** Index arithmetic under a caller-supplied leaf grouping, without reconstructing a physical quire. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leafIndex, leavesPerBifolium } = request;
  const compute = (): Output => {
    H.integer(leafIndex, 0);
    H.integer(leavesPerBifolium, 1);
    return {
      bifoliumIndex: Math.floor(leafIndex / leavesPerBifolium),
      slot: leafIndex % leavesPerBifolium,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leafIndex: 5, leavesPerBifolium: 2 },
  output: { bifoliumIndex: 2, slot: 1 },
} satisfies ToolExample<Input, Output>;
export const manuscriptQuireLeafParityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/manuscript-quire-leaf-parity",
    title: "Manuscript Quire Leaf Parity Tool",
    description:
      "Index arithmetic under a caller-supplied leaf grouping, without reconstructing a physical quire.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leafIndex: { type: "integer", minimum: 0 },
        leavesPerBifolium: { type: "integer", minimum: 1 },
      },
      required: ["leafIndex", "leavesPerBifolium"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bifoliumIndex: { type: "integer" },
        slot: { type: "integer" },
      },
      required: ["bifoliumIndex", "slot"],
    },
    ports: {
      inputs: [
        {
          id: "leafIndex",
          label: "Leaf Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "leavesPerBifolium",
          label: "Leaves Per Bifolium",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "bifoliumIndex",
          label: "Bifolium Index",
          valueType: { type: "integer" },
        },
        { id: "slot", label: "Slot", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = manuscriptQuireLeafParityTool.execute;
export default manuscriptQuireLeafParityTool;
