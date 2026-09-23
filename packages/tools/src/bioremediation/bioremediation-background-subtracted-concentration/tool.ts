import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly blank: number;
  readonly sampleFactor: number;
  readonly blankFactor: number;
};
export type Output = { readonly netConcentration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    blank: { type: "number" },
    sampleFactor: { type: "number", exclusiveMinimum: 0 },
    blankFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observed", "blank", "sampleFactor", "blankFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netConcentration: { type: "number" } },
  required: ["netConcentration"],
} as const;
/** One signed net assay concentration with explicitly matched sample and blank basis factors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, blank, sampleFactor, blankFactor } = request;
  const compute = (): Output => {
    H.positive(sampleFactor);
    H.positive(blankFactor);
    return { netConcentration: observed * sampleFactor - blank * blankFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 10, blank: 2, sampleFactor: 2, blankFactor: 3 },
  output: { netConcentration: 14 },
} satisfies ToolExample<Input, Output>;
export const bioremediationBackgroundSubtractedConcentrationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioremediation/bioremediation-background-subtracted-concentration",
      title: "Bioremediation Background Subtracted Concentration Tool",
      description:
        "One signed net assay concentration with explicitly matched sample and blank basis factors.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observed: { type: "number" },
          blank: { type: "number" },
          sampleFactor: { type: "number", exclusiveMinimum: 0 },
          blankFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["observed", "blank", "sampleFactor", "blankFactor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { netConcentration: { type: "number" } },
        required: ["netConcentration"],
      },
      ports: {
        inputs: [
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blank",
            label: "Blank",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sampleFactor",
            label: "Sample Factor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blankFactor",
            label: "Blank Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netConcentration",
            label: "Net Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = bioremediationBackgroundSubtractedConcentrationTool.execute;
export default bioremediationBackgroundSubtractedConcentrationTool;
