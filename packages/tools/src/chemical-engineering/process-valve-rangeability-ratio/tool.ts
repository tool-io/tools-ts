import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly maximumControllableFlow: number;
  readonly minimumControllableFlow: number;
};
export type Output = { readonly rangeability: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maximumControllableFlow: { type: "number" },
    minimumControllableFlow: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["maximumControllableFlow", "minimumControllableFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rangeability: { type: "number" } },
  required: ["rangeability"],
} as const;
/** Calculate rangeability from explicitly supplied maximum and minimum positive controllable valve flows on one test basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { maximumControllableFlow, minimumControllableFlow } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(minimumControllableFlow) && minimumControllableFlow > 0,
      "minimumControllableFlow",
    ),
      minimumControllableFlow);
    H.domain(
      maximumControllableFlow >= minimumControllableFlow,
      "maximumControllableFlow",
    );
    return { rangeability: maximumControllableFlow / minimumControllableFlow };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { maximumControllableFlow: 100, minimumControllableFlow: 4 },
  output: { rangeability: 25 },
} satisfies ToolExample<Input, Output>;
export const processValveRangeabilityRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["chemical-engineering", "chemical engineering", "engineering"],
      keywords: ["chemical engineering", "engineering"],
    },
    id: "chemical-engineering/process-valve-rangeability-ratio",
    title: "Process Valve Rangeability Ratio",
    description:
      "Calculate rangeability from explicitly supplied maximum and minimum positive controllable valve flows on one test basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        maximumControllableFlow: { type: "number" },
        minimumControllableFlow: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["maximumControllableFlow", "minimumControllableFlow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rangeability: { type: "number" } },
      required: ["rangeability"],
    },
    ports: {
      inputs: [
        {
          id: "maximumControllableFlow",
          label: "Maximum Controllable Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimumControllableFlow",
          label: "Minimum Controllable Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rangeability",
          label: "Rangeability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = processValveRangeabilityRatioTool.execute;
export default processValveRangeabilityRatioTool;
