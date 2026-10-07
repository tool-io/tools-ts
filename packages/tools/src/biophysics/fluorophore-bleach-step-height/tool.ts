import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeLevel: number;
  readonly afterLevel: number;
  readonly backgroundLevel: number;
};
export type Output = {
  readonly stepHeight: number;
  readonly backgroundCorrectedBefore: number;
  readonly relativeStep: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeLevel: { type: "number" },
    afterLevel: { type: "number" },
    backgroundLevel: { type: "number" },
  },
  required: ["beforeLevel", "afterLevel", "backgroundLevel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stepHeight: { type: "number" },
    backgroundCorrectedBefore: { type: "number" },
    relativeStep: { type: "number" },
  },
  required: ["stepHeight", "backgroundCorrectedBefore", "relativeStep"],
} as const;
/** Describe a signed observed fluorescence step and its fraction of a positive background-corrected initial level without inferring fluorophore count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeLevel, afterLevel, backgroundLevel } = request;
  const compute = (): Output => {
    H.domain(beforeLevel > backgroundLevel, "beforeLevel");
    return {
      stepHeight: beforeLevel - afterLevel,
      backgroundCorrectedBefore: beforeLevel - backgroundLevel,
      relativeStep:
        (beforeLevel - afterLevel) / (beforeLevel - backgroundLevel),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beforeLevel: 120, afterLevel: 90, backgroundLevel: 20 },
  output: { stepHeight: 30, backgroundCorrectedBefore: 100, relativeStep: 0.3 },
} satisfies ToolExample<Input, Output>;
export const fluorophoreBleachStepHeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biophysics", "physics"],
      keywords: ["biophysics", "physics"],
    },
    id: "biophysics/fluorophore-bleach-step-height",
    title: "Fluorophore Bleach Step Height",
    description:
      "Describe a signed observed fluorescence step and its fraction of a positive background-corrected initial level without inferring fluorophore count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeLevel: { type: "number" },
        afterLevel: { type: "number" },
        backgroundLevel: { type: "number" },
      },
      required: ["beforeLevel", "afterLevel", "backgroundLevel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stepHeight: { type: "number" },
        backgroundCorrectedBefore: { type: "number" },
        relativeStep: { type: "number" },
      },
      required: ["stepHeight", "backgroundCorrectedBefore", "relativeStep"],
    },
    ports: {
      inputs: [
        {
          id: "beforeLevel",
          label: "Before Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterLevel",
          label: "After Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "backgroundLevel",
          label: "Background Level",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "stepHeight",
          label: "Step Height",
          valueType: { type: "number" },
        },
        {
          id: "backgroundCorrectedBefore",
          label: "Background Corrected Before",
          valueType: { type: "number" },
        },
        {
          id: "relativeStep",
          label: "Relative Step",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fluorophoreBleachStepHeightTool.execute;
export default fluorophoreBleachStepHeightTool;
