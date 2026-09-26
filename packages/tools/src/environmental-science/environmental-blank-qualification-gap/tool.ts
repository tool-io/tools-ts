import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSignal: number;
  readonly blankSignal: number;
  readonly suppliedMultiplier: number;
};
export type Output = { readonly gap: number; readonly aboveBoundary: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSignal: { type: "number" },
    blankSignal: { type: "number", minimum: 0 },
    suppliedMultiplier: { type: "number", minimum: 0 },
  },
  required: ["sampleSignal", "blankSignal", "suppliedMultiplier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, aboveBoundary: { type: "boolean" } },
  required: ["gap", "aboveBoundary"],
} as const;
/** Compare a supplied signal with an explicit blank multiplier without selecting a regulatory qualification rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleSignal, blankSignal, suppliedMultiplier } = request;
  const compute = (): Output => {
    H.domain(blankSignal >= 0 && suppliedMultiplier >= 0);
    return {
      gap: sampleSignal - blankSignal * suppliedMultiplier,
      aboveBoundary: sampleSignal > blankSignal * suppliedMultiplier,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleSignal: 15, blankSignal: 3, suppliedMultiplier: 4 },
  output: { gap: 3, aboveBoundary: true },
} satisfies ToolExample<Input, Output>;
export const environmentalBlankQualificationGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/environmental-blank-qualification-gap",
    title: "Environmental Blank Qualification Gap Tool",
    description:
      "Compare a supplied signal with an explicit blank multiplier without selecting a regulatory qualification rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleSignal: { type: "number" },
        blankSignal: { type: "number", minimum: 0 },
        suppliedMultiplier: { type: "number", minimum: 0 },
      },
      required: ["sampleSignal", "blankSignal", "suppliedMultiplier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "number" },
        aboveBoundary: { type: "boolean" },
      },
      required: ["gap", "aboveBoundary"],
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
          id: "suppliedMultiplier",
          label: "Supplied Multiplier",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        {
          id: "aboveBoundary",
          label: "Above Boundary",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = environmentalBlankQualificationGapTool.execute;
export default environmentalBlankQualificationGapTool;
