import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstWidth: number;
  readonly secondWidth: number;
  readonly instarSteps: number;
};
export type Output = {
  readonly widthRatio: number;
  readonly logIncrementPerInstar: number;
  readonly dyarRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstWidth: { type: "number", exclusiveMinimum: 0 },
    secondWidth: { type: "number", exclusiveMinimum: 0 },
    instarSteps: { type: "integer", minimum: 1 },
  },
  required: ["firstWidth", "secondWidth", "instarSteps"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    widthRatio: { type: "number" },
    logIncrementPerInstar: { type: "number" },
    dyarRatio: { type: "number" },
  },
  required: ["widthRatio", "logIncrementPerInstar", "dyarRatio"],
} as const;
/** Calculate larval headcapsule log growth ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstWidth, secondWidth, instarSteps } = request;
  const compute = (): Output => {
    H.positive(firstWidth);
    H.positive(secondWidth);
    H.integer(instarSteps, 1);
    return {
      widthRatio: secondWidth / firstWidth,
      logIncrementPerInstar: Math.log(secondWidth / firstWidth) / instarSteps,
      dyarRatio: (secondWidth / firstWidth) ** (1 / instarSteps),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstWidth: 1, secondWidth: 4, instarSteps: 2 },
  output: {
    widthRatio: 4,
    logIncrementPerInstar: 0.6931471805599453,
    dyarRatio: 2,
  },
} satisfies ToolExample<Input, Output>;
export const larvalHeadcapsuleLogGrowthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/larval-headcapsule-log-growth-ratio",
    title: "Larval Headcapsule Log Growth Ratio Tool",
    description:
      "Calculate larval headcapsule log growth ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstWidth: { type: "number", exclusiveMinimum: 0 },
        secondWidth: { type: "number", exclusiveMinimum: 0 },
        instarSteps: { type: "integer", minimum: 1 },
      },
      required: ["firstWidth", "secondWidth", "instarSteps"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        widthRatio: { type: "number" },
        logIncrementPerInstar: { type: "number" },
        dyarRatio: { type: "number" },
      },
      required: ["widthRatio", "logIncrementPerInstar", "dyarRatio"],
    },
    ports: {
      inputs: [
        {
          id: "firstWidth",
          label: "First Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondWidth",
          label: "Second Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "instarSteps",
          label: "Instar Steps",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "widthRatio",
          label: "Width Ratio",
          valueType: { type: "number" },
        },
        {
          id: "logIncrementPerInstar",
          label: "Log Increment Per Instar",
          valueType: { type: "number" },
        },
        { id: "dyarRatio", label: "Dyar Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = larvalHeadcapsuleLogGrowthRatioTool.execute;
export default larvalHeadcapsuleLogGrowthRatioTool;
