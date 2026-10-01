import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stepDuration: number;
  readonly totalDuration: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stepDuration: { type: "number", minimum: 0 },
    totalDuration: { type: "number", minimum: 0 },
  },
  required: ["stepDuration", "totalDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Audit a supplied retrospective or simulated step-duration share without procedure instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stepDuration, totalDuration } = request;
  const compute = (): Output => {
    H.domain(
      totalDuration >= 0 && stepDuration >= 0 && stepDuration <= totalDuration,
    );
    return {
      share: totalDuration > 0 ? stepDuration / totalDuration : 0,
      defined: totalDuration > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stepDuration: 3, totalDuration: 12 },
  output: { share: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const procedureStepTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oral-surgery/procedure-step-time-share",
    title: "Procedure Step Time Share Tool",
    description:
      "Audit a supplied retrospective or simulated step-duration share without procedure instructions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stepDuration: { type: "number", minimum: 0 },
        totalDuration: { type: "number", minimum: 0 },
      },
      required: ["stepDuration", "totalDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "stepDuration",
          label: "Step Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalDuration",
          label: "Total Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = procedureStepTimeShareTool.execute;
export default procedureStepTimeShareTool;
