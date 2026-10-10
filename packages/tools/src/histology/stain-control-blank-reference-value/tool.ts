import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSignal: number;
  readonly blankSignal: number;
  readonly controlSignal: number;
};
export type Output = {
  readonly blankCorrected: number;
  readonly controlRelative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSignal: { type: "number" },
    blankSignal: { type: "number" },
    controlSignal: { type: "number" },
  },
  required: ["sampleSignal", "blankSignal", "controlSignal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blankCorrected: { type: "number" },
    controlRelative: { type: "number" },
  },
  required: ["blankCorrected", "controlRelative"],
} as const;
/** Normalize a supplied stain signal to an explicit blank-corrected control without inferring biological positivity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleSignal, blankSignal, controlSignal } = request;
  const compute = (): Output => {
    H.domain(controlSignal !== blankSignal, "controlSignal");
    return {
      blankCorrected: sampleSignal - blankSignal,
      controlRelative:
        (sampleSignal - blankSignal) / (controlSignal - blankSignal),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleSignal: 30, blankSignal: 10, controlSignal: 50 },
  output: { blankCorrected: 20, controlRelative: 0.5 },
} satisfies ToolExample<Input, Output>;
export const stainControlBlankReferenceValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["histology", "biology"],
      keywords: ["histology", "biology"],
    },
    id: "histology/stain-control-blank-reference-value",
    title: "Stain Control Blank Reference Value",
    description:
      "Normalize a supplied stain signal to an explicit blank-corrected control without inferring biological positivity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleSignal: { type: "number" },
        blankSignal: { type: "number" },
        controlSignal: { type: "number" },
      },
      required: ["sampleSignal", "blankSignal", "controlSignal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blankCorrected: { type: "number" },
        controlRelative: { type: "number" },
      },
      required: ["blankCorrected", "controlRelative"],
    },
    ports: {
      inputs: [
        {
          id: "sampleSignal",
          label: "Sample Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankSignal",
          label: "Blank Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "controlSignal",
          label: "Control Signal",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "blankCorrected",
          label: "Blank Corrected",
          valueType: { type: "number" },
        },
        {
          id: "controlRelative",
          label: "Control Relative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stainControlBlankReferenceValueTool.execute;
export default stainControlBlankReferenceValueTool;
