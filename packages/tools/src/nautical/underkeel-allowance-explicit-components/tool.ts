import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chartedDepth: number;
  readonly tideHeight: number;
  readonly draft: number;
  readonly squat: number;
  readonly reserve: number;
};
export type Output = { readonly clearance: number; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chartedDepth: { type: "number" },
    tideHeight: { type: "number" },
    draft: { type: "number", minimum: 0 },
    squat: { type: "number", minimum: 0 },
    reserve: { type: "number", minimum: 0 },
  },
  required: ["chartedDepth", "tideHeight", "draft", "squat", "reserve"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { clearance: { type: "number" }, margin: { type: "number" } },
  required: ["clearance", "margin"],
} as const;
/** Combine explicit vertical allowances without inferring vessel, port, or navigation safety requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chartedDepth, tideHeight, draft, squat, reserve } = request;
  const compute = (): Output => {
    H.domain(draft >= 0 && squat >= 0 && reserve >= 0);
    const clearance = chartedDepth + tideHeight - draft - squat;
    return { clearance, margin: clearance - reserve };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chartedDepth: 10, tideHeight: 2, draft: 8, squat: 0.5, reserve: 1 },
  output: { clearance: 3.5, margin: 2.5 },
} satisfies ToolExample<Input, Output>;
export const underkeelAllowanceExplicitComponentsTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "nautical/underkeel-allowance-explicit-components",
      title: "Underkeel Allowance Explicit Components Tool",
      description:
        "Combine explicit vertical allowances without inferring vessel, port, or navigation safety requirements.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          chartedDepth: { type: "number" },
          tideHeight: { type: "number" },
          draft: { type: "number", minimum: 0 },
          squat: { type: "number", minimum: 0 },
          reserve: { type: "number", minimum: 0 },
        },
        required: ["chartedDepth", "tideHeight", "draft", "squat", "reserve"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          clearance: { type: "number" },
          margin: { type: "number" },
        },
        required: ["clearance", "margin"],
      },
      ports: {
        inputs: [
          {
            id: "chartedDepth",
            label: "Charted Depth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "tideHeight",
            label: "Tide Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "draft",
            label: "Draft",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "squat",
            label: "Squat",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reserve",
            label: "Reserve",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "clearance",
            label: "Clearance",
            valueType: { type: "number" },
          },
          { id: "margin", label: "Margin", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = underkeelAllowanceExplicitComponentsTool.execute;
export default underkeelAllowanceExplicitComponentsTool;
