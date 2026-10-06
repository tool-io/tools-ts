import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedSetback: number;
  readonly suppliedRequiredSetback: number;
};
export type Output = {
  readonly margin: number;
  readonly meetsSuppliedSetback: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedSetback: { type: "number", minimum: 0 },
    suppliedRequiredSetback: { type: "number", minimum: 0 },
  },
  required: ["recordedSetback", "suppliedRequiredSetback"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    margin: { type: "number" },
    meetsSuppliedSetback: { type: "boolean" },
  },
  required: ["margin", "meetsSuppliedSetback"],
} as const;
/** Compare an explicit tree-row setback with a supplied requirement without choosing legal or agronomic standards. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedSetback, suppliedRequiredSetback } = request;
  const compute = (): Output => {
    H.domain(
      recordedSetback >= 0 && suppliedRequiredSetback >= 0,
      "recordedSetback",
    );
    return {
      margin: recordedSetback - suppliedRequiredSetback,
      meetsSuppliedSetback: recordedSetback >= suppliedRequiredSetback,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedSetback: 8, suppliedRequiredSetback: 5 },
  output: { margin: 3, meetsSuppliedSetback: true },
} satisfies ToolExample<Input, Output>;
export const treeRowSetbackMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroforestry", "agriculture"],
      keywords: ["agroforestry", "agriculture"],
    },
    id: "agroforestry/tree-row-setback-margin",
    title: "Tree Row Setback Margin",
    description:
      "Compare an explicit tree-row setback with a supplied requirement without choosing legal or agronomic standards.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedSetback: { type: "number", minimum: 0 },
        suppliedRequiredSetback: { type: "number", minimum: 0 },
      },
      required: ["recordedSetback", "suppliedRequiredSetback"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        margin: { type: "number" },
        meetsSuppliedSetback: { type: "boolean" },
      },
      required: ["margin", "meetsSuppliedSetback"],
    },
    ports: {
      inputs: [
        {
          id: "recordedSetback",
          label: "Recorded Setback",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRequiredSetback",
          label: "Supplied Required Setback",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "meetsSuppliedSetback",
          label: "Meets Supplied Setback",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeRowSetbackMarginTool.execute;
export default treeRowSetbackMarginTool;
