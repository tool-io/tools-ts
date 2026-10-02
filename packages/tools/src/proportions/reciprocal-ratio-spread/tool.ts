import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = {
  readonly ratio: number;
  readonly reciprocal: number;
  readonly signedSpread: number;
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
    ratio: { type: "number" },
    reciprocal: { type: "number" },
    signedSpread: { type: "number" },
  },
  required: ["ratio", "reciprocal", "signedSpread"],
} as const;
/** Calculate reciprocal ratio spread from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.domain(first !== 0 && second !== 0);
    return {
      ratio: first / second,
      reciprocal: second / first,
      signedSpread: first / second - second / first,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 4, second: 2 },
  output: { ratio: 2, reciprocal: 0.5, signedSpread: 1.5 },
} satisfies ToolExample<Input, Output>;
export const reciprocalRatioSpreadTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/reciprocal-ratio-spread",
    title: "Reciprocal Ratio Spread Tool",
    description:
      "Calculate reciprocal ratio spread from explicit caller-supplied inputs.",
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
        ratio: { type: "number" },
        reciprocal: { type: "number" },
        signedSpread: { type: "number" },
      },
      required: ["ratio", "reciprocal", "signedSpread"],
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
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "reciprocal",
          label: "Reciprocal",
          valueType: { type: "number" },
        },
        {
          id: "signedSpread",
          label: "Signed Spread",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reciprocalRatioSpreadTool.execute;
export default reciprocalRatioSpreadTool;
