import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allowedCycleSeconds: number;
  readonly observedCycleSeconds: number;
};
export type Output = {
  readonly marginSeconds: number;
  readonly exceedsAllowance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allowedCycleSeconds: { type: "number", minimum: 0 },
    observedCycleSeconds: { type: "number", minimum: 0 },
  },
  required: ["allowedCycleSeconds", "observedCycleSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marginSeconds: { type: "number" },
    exceedsAllowance: { type: "boolean" },
  },
  required: ["marginSeconds", "exceedsAllowance"],
} as const;
/** Compare an explicit station cycle observation with a caller-supplied cycle allowance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allowedCycleSeconds, observedCycleSeconds } = request;
  const compute = (): Output => {
    H.domain(
      allowedCycleSeconds >= 0 && observedCycleSeconds >= 0,
      "allowedCycleSeconds",
    );
    return {
      marginSeconds: allowedCycleSeconds - observedCycleSeconds,
      exceedsAllowance: observedCycleSeconds > allowedCycleSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allowedCycleSeconds: 60, observedCycleSeconds: 52 },
  output: { marginSeconds: 8, exceedsAllowance: false },
} satisfies ToolExample<Input, Output>;
export const workStationCycleMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "industrial-engineering",
        "industrial engineering",
        "engineering",
      ],
      keywords: ["industrial engineering", "engineering"],
    },
    id: "industrial-engineering/work-station-cycle-margin",
    title: "Work Station Cycle Margin",
    description:
      "Compare an explicit station cycle observation with a caller-supplied cycle allowance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allowedCycleSeconds: { type: "number", minimum: 0 },
        observedCycleSeconds: { type: "number", minimum: 0 },
      },
      required: ["allowedCycleSeconds", "observedCycleSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marginSeconds: { type: "number" },
        exceedsAllowance: { type: "boolean" },
      },
      required: ["marginSeconds", "exceedsAllowance"],
    },
    ports: {
      inputs: [
        {
          id: "allowedCycleSeconds",
          label: "Allowed Cycle Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedCycleSeconds",
          label: "Observed Cycle Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "marginSeconds",
          label: "Margin Seconds",
          valueType: { type: "number" },
        },
        {
          id: "exceedsAllowance",
          label: "Exceeds Allowance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = workStationCycleMarginTool.execute;
export default workStationCycleMarginTool;
