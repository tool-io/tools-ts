import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flow: number;
  readonly zeroBelongsToInspiration: boolean;
  readonly positiveIsInspiration: boolean;
};
export type Output = { readonly phase: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flow: { type: "number" },
    zeroBelongsToInspiration: { type: "boolean" },
    positiveIsInspiration: { type: "boolean" },
  },
  required: ["flow", "zeroBelongsToInspiration", "positiveIsInspiration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phase: { type: "string", maxLength: 8192 } },
  required: ["phase"],
} as const;
/** Assign a research trace sample under supplied flow sign and zero-boundary conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flow, zeroBelongsToInspiration, positiveIsInspiration } = request;
  const compute = (): Output => {
    return {
      phase:
        flow === 0
          ? zeroBelongsToInspiration
            ? "inspiration"
            : "expiration"
          : flow > 0 === positiveIsInspiration
            ? "inspiration"
            : "expiration",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    flow: 0,
    zeroBelongsToInspiration: true,
    positiveIsInspiration: true,
  },
  output: { phase: "inspiration" },
} satisfies ToolExample<Input, Output>;
export const respiratoryZeroFlowBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/respiratory-zero-flow-boundary",
    title: "Respiratory Zero Flow Boundary Tool",
    description:
      "Assign a research trace sample under supplied flow sign and zero-boundary conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flow: { type: "number" },
        zeroBelongsToInspiration: { type: "boolean" },
        positiveIsInspiration: { type: "boolean" },
      },
      required: ["flow", "zeroBelongsToInspiration", "positiveIsInspiration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phase: { type: "string", maxLength: 8192 } },
      required: ["phase"],
    },
    ports: {
      inputs: [
        {
          id: "flow",
          label: "Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroBelongsToInspiration",
          label: "Zero Belongs To Inspiration",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "positiveIsInspiration",
          label: "Positive Is Inspiration",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "phase", label: "Phase", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = respiratoryZeroFlowBoundaryTool.execute;
export default respiratoryZeroFlowBoundaryTool;
