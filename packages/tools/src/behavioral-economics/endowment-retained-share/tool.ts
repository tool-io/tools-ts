import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly initial: number; readonly retained: number };
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initial: { type: "number", minimum: 0 },
    retained: { type: "number", minimum: 0 },
  },
  required: ["initial", "retained"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate endowment retained share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initial, retained } = request;
  const compute = (): Output => {
    H.domain(initial >= 0 && retained >= 0 && retained <= initial);
    return {
      share: initial > 0 ? retained / initial : 0,
      defined: initial > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initial: 10, retained: 4 },
  output: { share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const endowmentRetainedShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/endowment-retained-share",
    title: "Endowment Retained Share Tool",
    description:
      "Calculate endowment retained share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initial: { type: "number", minimum: 0 },
        retained: { type: "number", minimum: 0 },
      },
      required: ["initial", "retained"],
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
          id: "initial",
          label: "Initial",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retained",
          label: "Retained",
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
export const run = endowmentRetainedShareTool.execute;
export default endowmentRetainedShareTool;
