import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingCycleCount: number;
  readonly completedAdditionalCycles: number;
};
export type Output = { readonly closingCycleCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingCycleCount: { type: "integer", minimum: 0 },
    completedAdditionalCycles: { type: "integer", minimum: 0 },
  },
  required: ["openingCycleCount", "completedAdditionalCycles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingCycleCount: { type: "integer" } },
  required: ["closingCycleCount"],
} as const;
/** Update an explicitly recorded whole charge-cycle counter without estimating battery state or remaining life. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingCycleCount, completedAdditionalCycles } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingCycleCount) &&
        openingCycleCount >= 0 &&
        openingCycleCount <= Number.MAX_SAFE_INTEGER,
      "openingCycleCount",
    ),
      openingCycleCount);
    (H.domain(
      Number.isSafeInteger(completedAdditionalCycles) &&
        completedAdditionalCycles >= 0 &&
        completedAdditionalCycles <= Number.MAX_SAFE_INTEGER,
      "completedAdditionalCycles",
    ),
      completedAdditionalCycles);
    return { closingCycleCount: openingCycleCount + completedAdditionalCycles };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingCycleCount: 120, completedAdditionalCycles: 3 },
  output: { closingCycleCount: 123 },
} satisfies ToolExample<Input, Output>;
export const hearingDeviceChargeCycleLogTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["audiology", "health and medicine"],
      keywords: ["audiology", "health and medicine"],
    },
    id: "audiology/hearing-device-charge-cycle-log",
    title: "Hearing Device Charge Cycle Log",
    description:
      "Update an explicitly recorded whole charge-cycle counter without estimating battery state or remaining life.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingCycleCount: { type: "integer", minimum: 0 },
        completedAdditionalCycles: { type: "integer", minimum: 0 },
      },
      required: ["openingCycleCount", "completedAdditionalCycles"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingCycleCount: { type: "integer" } },
      required: ["closingCycleCount"],
    },
    ports: {
      inputs: [
        {
          id: "openingCycleCount",
          label: "Opening Cycle Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "completedAdditionalCycles",
          label: "Completed Additional Cycles",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "closingCycleCount",
          label: "Closing Cycle Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = hearingDeviceChargeCycleLogTool.execute;
export default hearingDeviceChargeCycleLogTool;
