import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetMeasured: number;
  readonly sourceSignal: number;
  readonly spilloverFraction: number;
  readonly sourceBlank: number;
};
export type Output = {
  readonly spillover: number;
  readonly correctedTarget: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetMeasured: { type: "number" },
    sourceSignal: { type: "number" },
    spilloverFraction: { type: "number", minimum: 0 },
    sourceBlank: { type: "number" },
  },
  required: [
    "targetMeasured",
    "sourceSignal",
    "spilloverFraction",
    "sourceBlank",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spillover: { type: "number" },
    correctedTarget: { type: "number" },
  },
  required: ["spillover", "correctedTarget"],
} as const;
/** One explicit linear spillover subtraction from supplied signals, not a complete inverse compensation matrix or spectral unmixing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetMeasured, sourceSignal, spilloverFraction, sourceBlank } =
    request;
  const compute = (): Output => {
    H.domain(spilloverFraction >= 0);
    return {
      spillover: spilloverFraction * (sourceSignal - sourceBlank),
      correctedTarget:
        targetMeasured - spilloverFraction * (sourceSignal - sourceBlank),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    targetMeasured: 100,
    sourceSignal: 200,
    spilloverFraction: 0.1,
    sourceBlank: 20,
  },
  output: { spillover: 18, correctedTarget: 82 },
} satisfies ToolExample<Input, Output>;
export const flowCompensationOneSpilloverTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/flow-compensation-one-spillover-term",
    title: "Flow Compensation One Spillover Term Tool",
    description:
      "One explicit linear spillover subtraction from supplied signals, not a complete inverse compensation matrix or spectral unmixing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetMeasured: { type: "number" },
        sourceSignal: { type: "number" },
        spilloverFraction: { type: "number", minimum: 0 },
        sourceBlank: { type: "number" },
      },
      required: [
        "targetMeasured",
        "sourceSignal",
        "spilloverFraction",
        "sourceBlank",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spillover: { type: "number" },
        correctedTarget: { type: "number" },
      },
      required: ["spillover", "correctedTarget"],
    },
    ports: {
      inputs: [
        {
          id: "targetMeasured",
          label: "Target Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceSignal",
          label: "Source Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spilloverFraction",
          label: "Spillover Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceBlank",
          label: "Source Blank",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "spillover", label: "Spillover", valueType: { type: "number" } },
        {
          id: "correctedTarget",
          label: "Corrected Target",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = flowCompensationOneSpilloverTermTool.execute;
export default flowCompensationOneSpilloverTermTool;
