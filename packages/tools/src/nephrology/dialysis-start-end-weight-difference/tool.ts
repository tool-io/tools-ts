import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startKilograms: number;
  readonly endKilograms: number;
};
export type Output = { readonly startMinusEndKilograms: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startKilograms: { type: "number", minimum: 0 },
    endKilograms: { type: "number", minimum: 0 },
  },
  required: ["startKilograms", "endKilograms"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { startMinusEndKilograms: { type: "number" } },
  required: ["startMinusEndKilograms"],
} as const;
/** Compare explicitly measured session weights without equating weight difference to ultrafiltration or prescribing removal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startKilograms, endKilograms } = request;
  const compute = (): Output => {
    H.domain(startKilograms >= 0 && endKilograms >= 0, "startKilograms");
    return { startMinusEndKilograms: startKilograms - endKilograms };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startKilograms: 75, endKilograms: 73 },
  output: { startMinusEndKilograms: 2 },
} satisfies ToolExample<Input, Output>;
export const dialysisStartEndWeightDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nephrology", "health and medicine"],
      keywords: ["nephrology", "health and medicine"],
    },
    id: "nephrology/dialysis-start-end-weight-difference",
    title: "Dialysis Start End Weight Difference",
    description:
      "Compare explicitly measured session weights without equating weight difference to ultrafiltration or prescribing removal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startKilograms: { type: "number", minimum: 0 },
        endKilograms: { type: "number", minimum: 0 },
      },
      required: ["startKilograms", "endKilograms"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { startMinusEndKilograms: { type: "number" } },
      required: ["startMinusEndKilograms"],
    },
    ports: {
      inputs: [
        {
          id: "startKilograms",
          label: "Start Kilograms",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endKilograms",
          label: "End Kilograms",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "startMinusEndKilograms",
          label: "Start Minus End Kilograms",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dialysisStartEndWeightDifferenceTool.execute;
export default dialysisStartEndWeightDifferenceTool;
