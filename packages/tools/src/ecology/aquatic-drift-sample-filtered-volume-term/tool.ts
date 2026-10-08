import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly meanVolumeFlow: number;
  readonly samplingDuration: number;
};
export type Output = { readonly filteredVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanVolumeFlow: { type: "number", minimum: 0 },
    samplingDuration: { type: "number", minimum: 0 },
  },
  required: ["meanVolumeFlow", "samplingDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { filteredVolume: { type: "number" } },
  required: ["filteredVolume"],
} as const;
/** Multiply explicitly supplied mean filtered volume flow by sampling duration without estimating net efficiency or drift abundance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { meanVolumeFlow, samplingDuration } = request;
  const compute = (): Output => {
    H.domain(meanVolumeFlow >= 0, "meanVolumeFlow");
    H.domain(samplingDuration >= 0, "samplingDuration");
    return { filteredVolume: meanVolumeFlow * samplingDuration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { meanVolumeFlow: 0.5, samplingDuration: 20 },
  output: { filteredVolume: 10 },
} satisfies ToolExample<Input, Output>;
export const aquaticDriftSampleFilteredVolumeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ecology/aquatic-drift-sample-filtered-volume-term",
      title: "Aquatic Drift Sample Filtered Volume Term Tool",
      description:
        "Multiply explicitly supplied mean filtered volume flow by sampling duration without estimating net efficiency or drift abundance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          meanVolumeFlow: { type: "number", minimum: 0 },
          samplingDuration: { type: "number", minimum: 0 },
        },
        required: ["meanVolumeFlow", "samplingDuration"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { filteredVolume: { type: "number" } },
        required: ["filteredVolume"],
      },
      ports: {
        inputs: [
          {
            id: "meanVolumeFlow",
            label: "Mean Volume Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "samplingDuration",
            label: "Sampling Duration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "filteredVolume",
            label: "Filtered Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aquaticDriftSampleFilteredVolumeTermTool.execute;
export default aquaticDriftSampleFilteredVolumeTermTool;
