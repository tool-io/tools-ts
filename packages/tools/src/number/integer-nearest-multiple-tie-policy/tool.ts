import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly integer: number;
  readonly step: number;
  readonly tiesUp: boolean;
};
export type Output = { readonly multiple: number; readonly tied: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integer: { type: "integer" },
    step: { type: "integer", minimum: 1 },
    tiesUp: { type: "boolean" },
  },
  required: ["integer", "step", "tiesUp"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { multiple: { type: "integer" }, tied: { type: "boolean" } },
  required: ["multiple", "tied"],
} as const;
/** Calculate integer nearest multiple tie policy from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integer, step, tiesUp } = request;
  const compute = (): Output => {
    H.integer(step, 1);
    const q = Math.floor(integer / step),
      r = integer - q * step,
      tied = 2 * r === step;
    return {
      multiple: (q + (2 * r > step || (tied && tiesUp) ? 1 : 0)) * step,
      tied,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { integer: 15, step: 10, tiesUp: false },
  output: { multiple: 10, tied: true },
} satisfies ToolExample<Input, Output>;
export const integerNearestMultipleTiePolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/integer-nearest-multiple-tie-policy",
    title: "Integer Nearest Multiple Tie Policy Tool",
    description:
      "Calculate integer nearest multiple tie policy from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integer: { type: "integer" },
        step: { type: "integer", minimum: 1 },
        tiesUp: { type: "boolean" },
      },
      required: ["integer", "step", "tiesUp"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { multiple: { type: "integer" }, tied: { type: "boolean" } },
      required: ["multiple", "tied"],
    },
    ports: {
      inputs: [
        {
          id: "integer",
          label: "Integer",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tiesUp",
          label: "Ties Up",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "multiple", label: "Multiple", valueType: { type: "integer" } },
        { id: "tied", label: "Tied", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = integerNearestMultipleTiePolicyTool.execute;
export default integerNearestMultipleTiePolicyTool;
