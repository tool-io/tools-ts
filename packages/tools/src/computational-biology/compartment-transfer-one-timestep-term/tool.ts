import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceAmount: number;
  readonly targetAmount: number;
  readonly transferRate: number;
  readonly step: number;
};
export type Output = {
  readonly transferred: number;
  readonly nextSource: number;
  readonly nextTarget: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceAmount: { type: "number", minimum: 0 },
    targetAmount: { type: "number", minimum: 0 },
    transferRate: { type: "number", minimum: 0 },
    step: { type: "number", minimum: 0 },
  },
  required: ["sourceAmount", "targetAmount", "transferRate", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transferred: { type: "number" },
    nextSource: { type: "number" },
    nextTarget: { type: "number" },
  },
  required: ["transferred", "nextSource", "nextTarget"],
} as const;
/** One nonnegative explicit Euler transfer between closed compartments with conserved total amount. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceAmount, targetAmount, transferRate, step } = request;
  const compute = (): Output => {
    H.domain(
      sourceAmount >= 0 &&
        targetAmount >= 0 &&
        transferRate >= 0 &&
        step >= 0 &&
        transferRate * step <= 1,
    );
    return {
      transferred: sourceAmount * transferRate * step,
      nextSource: sourceAmount * (1 - transferRate * step),
      nextTarget: targetAmount + sourceAmount * transferRate * step,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceAmount: 100, targetAmount: 20, transferRate: 0.1, step: 2 },
  output: { transferred: 20, nextSource: 80, nextTarget: 40 },
} satisfies ToolExample<Input, Output>;
export const compartmentTransferOneTimestepTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/compartment-transfer-one-timestep-term",
    title: "Compartment Transfer One Timestep Term Tool",
    description:
      "One nonnegative explicit Euler transfer between closed compartments with conserved total amount.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceAmount: { type: "number", minimum: 0 },
        targetAmount: { type: "number", minimum: 0 },
        transferRate: { type: "number", minimum: 0 },
        step: { type: "number", minimum: 0 },
      },
      required: ["sourceAmount", "targetAmount", "transferRate", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transferred: { type: "number" },
        nextSource: { type: "number" },
        nextTarget: { type: "number" },
      },
      required: ["transferred", "nextSource", "nextTarget"],
    },
    ports: {
      inputs: [
        {
          id: "sourceAmount",
          label: "Source Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetAmount",
          label: "Target Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transferRate",
          label: "Transfer Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "transferred",
          label: "Transferred",
          valueType: { type: "number" },
        },
        {
          id: "nextSource",
          label: "Next Source",
          valueType: { type: "number" },
        },
        {
          id: "nextTarget",
          label: "Next Target",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = compartmentTransferOneTimestepTermTool.execute;
export default compartmentTransferOneTimestepTermTool;
