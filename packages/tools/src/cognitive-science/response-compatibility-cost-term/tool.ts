import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly incompatibleLatency: number;
  readonly compatibleLatency: number;
};
export type Output = { readonly cost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incompatibleLatency: { type: "number", minimum: 0 },
    compatibleLatency: { type: "number", minimum: 0 },
  },
  required: ["incompatibleLatency", "compatibleLatency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cost: { type: "number" } },
  required: ["cost"],
} as const;
/** Calculate response compatibility cost term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { incompatibleLatency, compatibleLatency } = request;
  const compute = (): Output => {
    H.domain(incompatibleLatency >= 0 && compatibleLatency >= 0);
    return { cost: incompatibleLatency - compatibleLatency };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { incompatibleLatency: 520, compatibleLatency: 480 },
  output: { cost: 40 },
} satisfies ToolExample<Input, Output>;
export const responseCompatibilityCostTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cognitive-science/response-compatibility-cost-term",
    title: "Response Compatibility Cost Term Tool",
    description:
      "Calculate response compatibility cost term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        incompatibleLatency: { type: "number", minimum: 0 },
        compatibleLatency: { type: "number", minimum: 0 },
      },
      required: ["incompatibleLatency", "compatibleLatency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cost: { type: "number" } },
      required: ["cost"],
    },
    ports: {
      inputs: [
        {
          id: "incompatibleLatency",
          label: "Incompatible Latency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "compatibleLatency",
          label: "Compatible Latency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "cost", label: "Cost", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = responseCompatibilityCostTermTool.execute;
export default responseCompatibilityCostTermTool;
