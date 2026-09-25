import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly left: number; readonly right: number };
export type Output = {
  readonly total: number;
  readonly signedDifference: number;
  readonly asymmetry: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "integer", minimum: 0 },
    right: { type: "integer", minimum: 0 },
  },
  required: ["left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "integer" },
    signedDifference: { type: "integer" },
    asymmetry: { type: "number" },
  },
  required: ["total", "signedDifference", "asymmetry"],
} as const;
/** Calculate somite count left right difference from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { left, right } = request;
  const compute = (): Output => {
    H.integer(left, 0);
    H.integer(right, 0);
    H.domain(left + right > 0);
    return {
      total: left + right,
      signedDifference: left - right,
      asymmetry: (left - right) / (left + right),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { left: 12, right: 10 },
  output: { total: 22, signedDifference: 2, asymmetry: 0.09090909090909091 },
} satisfies ToolExample<Input, Output>;
export const somiteCountLeftRightDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/somite-count-left-right-difference",
    title: "Somite Count Left Right Difference Tool",
    description:
      "Calculate somite count left right difference from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        left: { type: "integer", minimum: 0 },
        right: { type: "integer", minimum: 0 },
      },
      required: ["left", "right"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        total: { type: "integer" },
        signedDifference: { type: "integer" },
        asymmetry: { type: "number" },
      },
      required: ["total", "signedDifference", "asymmetry"],
    },
    ports: {
      inputs: [
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "total", label: "Total", valueType: { type: "integer" } },
        {
          id: "signedDifference",
          label: "Signed Difference",
          valueType: { type: "integer" },
        },
        { id: "asymmetry", label: "Asymmetry", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = somiteCountLeftRightDifferenceTool.execute;
export default somiteCountLeftRightDifferenceTool;
