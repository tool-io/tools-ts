import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSignal: number;
  readonly systemBlank: number;
  readonly referenceNetSignal: number;
  readonly suppliedGain: number;
};
export type Output = {
  readonly correctedSignal: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSignal: { type: "number" },
    systemBlank: { type: "number" },
    referenceNetSignal: { type: "number" },
    suppliedGain: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "sampleSignal",
    "systemBlank",
    "referenceNetSignal",
    "suppliedGain",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedSignal: { type: "number" },
    residual: { type: "number" },
  },
  required: ["correctedSignal", "residual"],
} as const;
/** Compare supplied bench assay blank/gain corrections without determining assay acceptance or clinical significance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleSignal, systemBlank, referenceNetSignal, suppliedGain } =
    request;
  const compute = (): Output => {
    H.positive(suppliedGain);
    return {
      correctedSignal: (sampleSignal - systemBlank) * suppliedGain,
      residual:
        (sampleSignal - systemBlank) * suppliedGain - referenceNetSignal,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleSignal: 12,
    systemBlank: 2,
    referenceNetSignal: 18,
    suppliedGain: 2,
  },
  output: { correctedSignal: 20, residual: 2 },
} satisfies ToolExample<Input, Output>;
export const assaySystemBlankResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/assay-system-blank-residual",
    title: "Assay System Blank Residual Tool",
    description:
      "Compare supplied bench assay blank/gain corrections without determining assay acceptance or clinical significance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleSignal: { type: "number" },
        systemBlank: { type: "number" },
        referenceNetSignal: { type: "number" },
        suppliedGain: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "sampleSignal",
        "systemBlank",
        "referenceNetSignal",
        "suppliedGain",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedSignal: { type: "number" },
        residual: { type: "number" },
      },
      required: ["correctedSignal", "residual"],
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
          id: "systemBlank",
          label: "System Blank",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceNetSignal",
          label: "Reference Net Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedGain",
          label: "Supplied Gain",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedSignal",
          label: "Corrected Signal",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = assaySystemBlankResidualTool.execute;
export default assaySystemBlankResidualTool;
