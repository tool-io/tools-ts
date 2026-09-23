import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSignal: number;
  readonly blankSignal: number;
  readonly sampleMass: number;
  readonly blankEquivalentMass: number;
};
export type Output = {
  readonly scaledBlank: number;
  readonly correctedPerMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSignal: { type: "number" },
    blankSignal: { type: "number" },
    sampleMass: { type: "number", exclusiveMinimum: 0 },
    blankEquivalentMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "sampleSignal",
    "blankSignal",
    "sampleMass",
    "blankEquivalentMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaledBlank: { type: "number" },
    correctedPerMass: { type: "number" },
  },
  required: ["scaledBlank", "correctedPerMass"],
} as const;
/** Scale a supplied blank to a common mass basis without selecting remediation agents or conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleSignal, blankSignal, sampleMass, blankEquivalentMass } =
    request;
  const compute = (): Output => {
    H.positive(sampleMass);
    H.positive(blankEquivalentMass);
    return {
      scaledBlank: (blankSignal * sampleMass) / blankEquivalentMass,
      correctedPerMass:
        (sampleSignal - (blankSignal * sampleMass) / blankEquivalentMass) /
        sampleMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleSignal: 20,
    blankSignal: 2,
    sampleMass: 10,
    blankEquivalentMass: 5,
  },
  output: { scaledBlank: 4, correctedPerMass: 1.6 },
} satisfies ToolExample<Input, Output>;
export const remediationBlankBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/remediation-blank-basis-factor",
    title: "Remediation Blank Basis Factor Tool",
    description:
      "Scale a supplied blank to a common mass basis without selecting remediation agents or conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleSignal: { type: "number" },
        blankSignal: { type: "number" },
        sampleMass: { type: "number", exclusiveMinimum: 0 },
        blankEquivalentMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "sampleSignal",
        "blankSignal",
        "sampleMass",
        "blankEquivalentMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaledBlank: { type: "number" },
        correctedPerMass: { type: "number" },
      },
      required: ["scaledBlank", "correctedPerMass"],
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
          id: "sampleMass",
          label: "Sample Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankEquivalentMass",
          label: "Blank Equivalent Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaledBlank",
          label: "Scaled Blank",
          valueType: { type: "number" },
        },
        {
          id: "correctedPerMass",
          label: "Corrected Per Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = remediationBlankBasisFactorTool.execute;
export default remediationBlankBasisFactorTool;
