import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loss: number;
  readonly compensation: number;
  readonly restorationValue: number;
};
export type Output = {
  readonly uncompensated: number;
  readonly overcompensation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loss: { type: "number", minimum: 0 },
    compensation: { type: "number", minimum: 0 },
    restorationValue: { type: "number", minimum: 0 },
  },
  required: ["loss", "compensation", "restorationValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncompensated: { type: "number" },
    overcompensation: { type: "number" },
  },
  required: ["uncompensated", "overcompensation"],
} as const;
/** Calculate compensation restoration net loss term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loss, compensation, restorationValue } = request;
  const compute = (): Output => {
    H.domain(loss >= 0 && compensation >= 0 && restorationValue >= 0);
    return {
      uncompensated: Math.max(0, loss - compensation - restorationValue),
      overcompensation: Math.max(0, compensation + restorationValue - loss),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { loss: 100, compensation: 60, restorationValue: 20 },
  output: { uncompensated: 20, overcompensation: 0 },
} satisfies ToolExample<Input, Output>;
export const compensationRestorationNetLossTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/compensation-restoration-net-loss-term",
    title: "Compensation Restoration Net Loss Term Tool",
    description:
      "Calculate compensation restoration net loss term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loss: { type: "number", minimum: 0 },
        compensation: { type: "number", minimum: 0 },
        restorationValue: { type: "number", minimum: 0 },
      },
      required: ["loss", "compensation", "restorationValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncompensated: { type: "number" },
        overcompensation: { type: "number" },
      },
      required: ["uncompensated", "overcompensation"],
    },
    ports: {
      inputs: [
        {
          id: "loss",
          label: "Loss",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "compensation",
          label: "Compensation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "restorationValue",
          label: "Restoration Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uncompensated",
          label: "Uncompensated",
          valueType: { type: "number" },
        },
        {
          id: "overcompensation",
          label: "Overcompensation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = compensationRestorationNetLossTermTool.execute;
export default compensationRestorationNetLossTermTool;
