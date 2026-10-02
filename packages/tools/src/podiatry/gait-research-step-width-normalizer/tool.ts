import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLateral: number;
  readonly secondLateral: number;
  readonly legLength: number;
  readonly scaleFactor: number;
};
export type Output = {
  readonly signedWidth: number;
  readonly absoluteWidth: number;
  readonly normalized: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLateral: { type: "number" },
    secondLateral: { type: "number" },
    legLength: { type: "number", exclusiveMinimum: 0 },
    scaleFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstLateral", "secondLateral", "legLength", "scaleFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedWidth: { type: "number" },
    absoluteWidth: { type: "number" },
    normalized: { type: "number" },
  },
  required: ["signedWidth", "absoluteWidth", "normalized"],
} as const;
/** Calculate gait research step width normalizer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLateral, secondLateral, legLength, scaleFactor } = request;
  const compute = (): Output => {
    H.positive(legLength);
    H.positive(scaleFactor);
    return {
      signedWidth: secondLateral - firstLateral,
      absoluteWidth: Math.abs(secondLateral - firstLateral),
      normalized:
        (Math.abs(secondLateral - firstLateral) * scaleFactor) / legLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstLateral: -5,
    secondLateral: 7,
    legLength: 100,
    scaleFactor: 100,
  },
  output: { signedWidth: 12, absoluteWidth: 12, normalized: 12 },
} satisfies ToolExample<Input, Output>;
export const gaitResearchStepWidthNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "podiatry/gait-research-step-width-normalizer",
    title: "Gait Research Step Width Normalizer Tool",
    description:
      "Calculate gait research step width normalizer from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLateral: { type: "number" },
        secondLateral: { type: "number" },
        legLength: { type: "number", exclusiveMinimum: 0 },
        scaleFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstLateral", "secondLateral", "legLength", "scaleFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedWidth: { type: "number" },
        absoluteWidth: { type: "number" },
        normalized: { type: "number" },
      },
      required: ["signedWidth", "absoluteWidth", "normalized"],
    },
    ports: {
      inputs: [
        {
          id: "firstLateral",
          label: "First Lateral",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLateral",
          label: "Second Lateral",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "legLength",
          label: "Leg Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleFactor",
          label: "Scale Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedWidth",
          label: "Signed Width",
          valueType: { type: "number" },
        },
        {
          id: "absoluteWidth",
          label: "Absolute Width",
          valueType: { type: "number" },
        },
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gaitResearchStepWidthNormalizerTool.execute;
export default gaitResearchStepWidthNormalizerTool;
