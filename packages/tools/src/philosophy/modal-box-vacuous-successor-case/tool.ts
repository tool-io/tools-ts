import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly successorValues: readonly boolean[] };
export type Output = {
  readonly box: boolean;
  readonly diamond: boolean;
  readonly vacuous: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    successorValues: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["successorValues"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    box: { type: "boolean" },
    diamond: { type: "boolean" },
    vacuous: { type: "boolean" },
  },
  required: ["box", "diamond", "vacuous"],
} as const;
/** Evaluate box and diamond on an explicit finite list of accessible successor truth values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { successorValues } = request;
  const compute = (): Output => {
    return {
      box: successorValues.every(Boolean),
      diamond: successorValues.some(Boolean),
      vacuous: successorValues.length === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { successorValues: [] },
  output: { box: true, diamond: false, vacuous: true },
} satisfies ToolExample<Input, Output>;
export const modalBoxVacuousSuccessorCaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/modal-box-vacuous-successor-case",
    title: "Modal Box Vacuous Successor Case Tool",
    description:
      "Evaluate box and diamond on an explicit finite list of accessible successor truth values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        successorValues: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["successorValues"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        box: { type: "boolean" },
        diamond: { type: "boolean" },
        vacuous: { type: "boolean" },
      },
      required: ["box", "diamond", "vacuous"],
    },
    ports: {
      inputs: [
        {
          id: "successorValues",
          label: "Successor Values",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "box", label: "Box", valueType: { type: "boolean" } },
        { id: "diamond", label: "Diamond", valueType: { type: "boolean" } },
        { id: "vacuous", label: "Vacuous", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = modalBoxVacuousSuccessorCaseTool.execute;
export default modalBoxVacuousSuccessorCaseTool;
