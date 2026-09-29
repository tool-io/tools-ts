import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAge: number;
  readonly secondAge: number;
  readonly referenceAge: number;
};
export type Output = {
  readonly signedGap: number;
  readonly meanAge: number;
  readonly meanReferenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAge: { type: "integer", minimum: 0 },
    secondAge: { type: "integer", minimum: 0 },
    referenceAge: { type: "number", minimum: 0 },
  },
  required: ["firstAge", "secondAge", "referenceAge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGap: { type: "integer" },
    meanAge: { type: "number" },
    meanReferenceGap: { type: "number" },
  },
  required: ["signedGap", "meanAge", "meanReferenceGap"],
} as const;
/** Descriptive paired reader age difference, not adjudicated age or precision statistics across fish. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAge, secondAge, referenceAge } = request;
  const compute = (): Output => {
    H.integer(firstAge, 0);
    H.integer(secondAge, 0);
    H.domain(referenceAge >= 0);
    return {
      signedGap: secondAge - firstAge,
      meanAge: (firstAge + secondAge) / 2,
      meanReferenceGap: (firstAge + secondAge) / 2 - referenceAge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstAge: 4, secondAge: 6, referenceAge: 4.5 },
  output: { signedGap: 2, meanAge: 5, meanReferenceGap: 0.5 },
} satisfies ToolExample<Input, Output>;
export const otolithTwoReaderAgeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/otolith-two-reader-age-gap",
    title: "Otolith Two Reader Age Gap Tool",
    description:
      "Descriptive paired reader age difference, not adjudicated age or precision statistics across fish.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAge: { type: "integer", minimum: 0 },
        secondAge: { type: "integer", minimum: 0 },
        referenceAge: { type: "number", minimum: 0 },
      },
      required: ["firstAge", "secondAge", "referenceAge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedGap: { type: "integer" },
        meanAge: { type: "number" },
        meanReferenceGap: { type: "number" },
      },
      required: ["signedGap", "meanAge", "meanReferenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstAge",
          label: "First Age",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondAge",
          label: "Second Age",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceAge",
          label: "Reference Age",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedGap",
          label: "Signed Gap",
          valueType: { type: "integer" },
        },
        { id: "meanAge", label: "Mean Age", valueType: { type: "number" } },
        {
          id: "meanReferenceGap",
          label: "Mean Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = otolithTwoReaderAgeGapTool.execute;
export default otolithTwoReaderAgeGapTool;
