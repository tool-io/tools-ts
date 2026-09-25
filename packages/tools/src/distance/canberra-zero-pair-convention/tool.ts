import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = {
  readonly contribution: number;
  readonly bothZero: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { first: { type: "number" }, second: { type: "number" } },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contribution: { type: "number" },
    bothZero: { type: "boolean" },
  },
  required: ["contribution", "bothZero"],
} as const;
/** Calculate canberra zero pair convention from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    const d = Math.abs(first) + Math.abs(second);
    return {
      contribution: d === 0 ? 0 : Math.abs(first - second) / d,
      bothZero: d === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 0, second: 0 },
  output: { contribution: 0, bothZero: true },
} satisfies ToolExample<Input, Output>;
export const canberraZeroPairConventionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/canberra-zero-pair-convention",
    title: "Canberra Zero Pair Convention Tool",
    description:
      "Calculate canberra zero pair convention from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { first: { type: "number" }, second: { type: "number" } },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contribution: { type: "number" },
        bothZero: { type: "boolean" },
      },
      required: ["contribution", "bothZero"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
        { id: "bothZero", label: "Both Zero", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = canberraZeroPairConventionTool.execute;
export default canberraZeroPairConventionTool;
