import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedExcursionStartMinutes: number;
  readonly recordedExcursionEndMinutes: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedExcursionStartMinutes: { type: "number" },
    recordedExcursionEndMinutes: { type: "number" },
  },
  required: ["recordedExcursionStartMinutes", "recordedExcursionEndMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicitly recorded refrigerator excursion markers without setting stability or storage limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedExcursionStartMinutes, recordedExcursionEndMinutes } =
    request;
  const compute = (): Output => {
    return {
      signedGap: recordedExcursionEndMinutes - recordedExcursionStartMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedExcursionStartMinutes: 12, recordedExcursionEndMinutes: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const pharmacyFridgeExcursionTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hospital-pharmacy", "hospital pharmacy", "pharmacy"],
      keywords: ["hospital pharmacy", "pharmacy"],
    },
    id: "hospital-pharmacy/pharmacy-fridge-excursion-time-gap",
    title: "Pharmacy Fridge Excursion Time Gap",
    description:
      "Subtract explicitly recorded refrigerator excursion markers without setting stability or storage limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedExcursionStartMinutes: { type: "number" },
        recordedExcursionEndMinutes: { type: "number" },
      },
      required: [
        "recordedExcursionStartMinutes",
        "recordedExcursionEndMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "recordedExcursionStartMinutes",
          label: "Recorded Excursion Start Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedExcursionEndMinutes",
          label: "Recorded Excursion End Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pharmacyFridgeExcursionTimeGapTool.execute;
export default pharmacyFridgeExcursionTimeGapTool;
