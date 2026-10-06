import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly phase: string;
  readonly phaseSource: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    phase: {
      type: "string",
      maxLength: 8192,
      enum: ["flood", "ebb", "high-water", "low-water", "slack", "unknown"],
    },
    phaseSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "phase", "phaseSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach an explicitly observed tide-phase category and source to an aquatic sample without predicting tide times. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, phase, phaseSource } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0 && phaseSource.length > 0, "sampleId");
    H.domain(
      ["flood", "ebb", "high-water", "low-water", "slack", "unknown"].includes(
        phase,
      ),
      "phase",
    );
    return { label: sampleId + " [tide=" + phase + "; " + phaseSource + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleId: "S17", phase: "ebb", phaseSource: "station observation" },
  output: { label: "S17 [tide=ebb; station observation]" },
} satisfies ToolExample<Input, Output>;
export const aquaticSampleTidePhaseLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "aquatic-science",
        "aquatic science",
        "earth and environmental sciences",
      ],
      keywords: ["aquatic science", "earth and environmental sciences"],
    },
    id: "aquatic-science/aquatic-sample-tide-phase-label",
    title: "Aquatic Sample Tide Phase Label",
    description:
      "Attach an explicitly observed tide-phase category and source to an aquatic sample without predicting tide times.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        phase: {
          type: "string",
          maxLength: 8192,
          enum: ["flood", "ebb", "high-water", "low-water", "slack", "unknown"],
        },
        phaseSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "phase", "phaseSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "phase",
          label: "Phase",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "phaseSource",
          label: "Phase Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = aquaticSampleTidePhaseLabelTool.execute;
export default aquaticSampleTidePhaseLabelTool;
