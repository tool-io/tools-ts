import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialLevel: number;
  readonly stepCount: number;
  readonly stepSize: number;
  readonly descending: boolean;
};
export type Output = { readonly level: number; readonly totalChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialLevel: { type: "number" },
    stepCount: { type: "integer", minimum: 0 },
    stepSize: { type: "number", minimum: 0 },
    descending: { type: "boolean" },
  },
  required: ["initialLevel", "stepCount", "stepSize", "descending"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { level: { type: "number" }, totalChange: { type: "number" } },
  required: ["level", "totalChange"],
} as const;
/** Supplied bench/research level-step bookkeeping, without hearing threshold or presentation-level guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialLevel, stepCount, stepSize, descending } = request;
  const compute = (): Output => {
    H.integer(stepCount, 0);
    H.domain(stepSize >= 0);
    return {
      level: initialLevel + stepCount * stepSize * (descending ? -1 : 1),
      totalChange: stepCount * stepSize * (descending ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialLevel: 40, stepCount: 3, stepSize: 5, descending: true },
  output: { level: 25, totalChange: -15 },
} satisfies ToolExample<Input, Output>;
export const tonePresentationLevelStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "audiology/tone-presentation-level-step",
    title: "Tone Presentation Level Step Tool",
    description:
      "Supplied bench/research level-step bookkeeping, without hearing threshold or presentation-level guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialLevel: { type: "number" },
        stepCount: { type: "integer", minimum: 0 },
        stepSize: { type: "number", minimum: 0 },
        descending: { type: "boolean" },
      },
      required: ["initialLevel", "stepCount", "stepSize", "descending"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        level: { type: "number" },
        totalChange: { type: "number" },
      },
      required: ["level", "totalChange"],
    },
    ports: {
      inputs: [
        {
          id: "initialLevel",
          label: "Initial Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stepCount",
          label: "Step Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "stepSize",
          label: "Step Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "descending",
          label: "Descending",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "level", label: "Level", valueType: { type: "number" } },
        {
          id: "totalChange",
          label: "Total Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tonePresentationLevelStepTool.execute;
export default tonePresentationLevelStepTool;
