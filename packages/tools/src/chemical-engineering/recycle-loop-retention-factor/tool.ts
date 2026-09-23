import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recycleFraction: number;
  readonly perPassRetention: number;
};
export type Output = {
  readonly loopRetention: number;
  readonly geometricMultiplier: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recycleFraction: { type: "number", minimum: 0, maximum: 1 },
    perPassRetention: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["recycleFraction", "perPassRetention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loopRetention: { type: "number" },
    geometricMultiplier: { type: "number" },
  },
  required: ["loopRetention", "geometricMultiplier"],
} as const;
/** Sum an ideal convergent geometric recycle series from explicit retained fractions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recycleFraction, perPassRetention } = request;
  const compute = (): Output => {
    H.probability(recycleFraction);
    H.probability(perPassRetention);
    H.domain(recycleFraction * perPassRetention < 1);
    return {
      loopRetention: recycleFraction * perPassRetention,
      geometricMultiplier: 1 / (1 - recycleFraction * perPassRetention),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recycleFraction: 0.5, perPassRetention: 0.5 },
  output: { loopRetention: 0.25, geometricMultiplier: 1.3333333333333333 },
} satisfies ToolExample<Input, Output>;
export const recycleLoopRetentionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/recycle-loop-retention-factor",
    title: "Recycle Loop Retention Factor Tool",
    description:
      "Sum an ideal convergent geometric recycle series from explicit retained fractions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recycleFraction: { type: "number", minimum: 0, maximum: 1 },
        perPassRetention: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["recycleFraction", "perPassRetention"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loopRetention: { type: "number" },
        geometricMultiplier: { type: "number" },
      },
      required: ["loopRetention", "geometricMultiplier"],
    },
    ports: {
      inputs: [
        {
          id: "recycleFraction",
          label: "Recycle Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "perPassRetention",
          label: "Per Pass Retention",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "loopRetention",
          label: "Loop Retention",
          valueType: { type: "number" },
        },
        {
          id: "geometricMultiplier",
          label: "Geometric Multiplier",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recycleLoopRetentionFactorTool.execute;
export default recycleLoopRetentionFactorTool;
