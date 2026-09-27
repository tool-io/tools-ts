import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeMass: number;
  readonly afterMass: number;
  readonly referenceLoss: number;
};
export type Output = {
  readonly measuredLoss: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeMass: { type: "number", exclusiveMinimum: 0 },
    afterMass: { type: "number", minimum: 0 },
    referenceLoss: { type: "number" },
  },
  required: ["beforeMass", "afterMass", "referenceLoss"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredLoss: { type: "number" },
    residual: { type: "number" },
  },
  required: ["measuredLoss", "residual"],
} as const;
/** Compare measured ignition mass change with an explicit reference; mass gains remain visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeMass, afterMass, referenceLoss } = request;
  const compute = (): Output => {
    H.positive(beforeMass);
    H.domain(afterMass >= 0);
    return {
      measuredLoss: beforeMass - afterMass,
      residual: beforeMass - afterMass - referenceLoss,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beforeMass: 10, afterMass: 8, referenceLoss: 1.5 },
  output: { measuredLoss: 2, residual: 0.5 },
} satisfies ToolExample<Input, Output>;
export const lossOnIgnitionMassGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/loss-on-ignition-mass-gap",
    title: "Loss On Ignition Mass Gap Tool",
    description:
      "Compare measured ignition mass change with an explicit reference; mass gains remain visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeMass: { type: "number", exclusiveMinimum: 0 },
        afterMass: { type: "number", minimum: 0 },
        referenceLoss: { type: "number" },
      },
      required: ["beforeMass", "afterMass", "referenceLoss"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredLoss: { type: "number" },
        residual: { type: "number" },
      },
      required: ["measuredLoss", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "beforeMass",
          label: "Before Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterMass",
          label: "After Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLoss",
          label: "Reference Loss",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "measuredLoss",
          label: "Measured Loss",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = lossOnIgnitionMassGapTool.execute;
export default lossOnIgnitionMassGapTool;
