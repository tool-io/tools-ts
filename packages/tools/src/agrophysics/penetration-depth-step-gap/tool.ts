import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDepth: number;
  readonly secondDepth: number;
  readonly referenceStep: number;
};
export type Output = { readonly step: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDepth: { type: "number" },
    secondDepth: { type: "number" },
    referenceStep: { type: "number", minimum: 0 },
  },
  required: ["firstDepth", "secondDepth", "referenceStep"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { step: { type: "number" }, residual: { type: "number" } },
  required: ["step", "residual"],
} as const;
/** Calculate penetration depth step gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDepth, secondDepth, referenceStep } = request;
  const compute = (): Output => {
    H.domain(referenceStep >= 0);
    return {
      step: secondDepth - firstDepth,
      residual: secondDepth - firstDepth - referenceStep,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDepth: 10, secondDepth: 15, referenceStep: 4 },
  output: { step: 5, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const penetrationDepthStepGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/penetration-depth-step-gap",
    title: "Penetration Depth Step Gap Tool",
    description:
      "Calculate penetration depth step gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDepth: { type: "number" },
        secondDepth: { type: "number" },
        referenceStep: { type: "number", minimum: 0 },
      },
      required: ["firstDepth", "secondDepth", "referenceStep"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { step: { type: "number" }, residual: { type: "number" } },
      required: ["step", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "firstDepth",
          label: "First Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDepth",
          label: "Second Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceStep",
          label: "Reference Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "step", label: "Step", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = penetrationDepthStepGapTool.execute;
export default penetrationDepthStepGapTool;
