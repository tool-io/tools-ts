import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly index: number; readonly anchor: number };
export type Output = {
  readonly distanceDecimal: string;
  readonly sign: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "integer" }, anchor: { type: "integer" } },
  required: ["index", "anchor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distanceDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    sign: { type: "integer" },
  },
  required: ["distanceDecimal", "sign"],
} as const;
/** Calculate list anchor relative index sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { index, anchor } = request;
  const compute = (): Output => {
    return {
      distanceDecimal: (BigInt(index) - BigInt(anchor)).toString(),
      sign: index > anchor ? 1 : index < anchor ? -1 : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { index: 12, anchor: 10 },
  output: { distanceDecimal: "2", sign: 1 },
} satisfies ToolExample<Input, Output>;
export const listAnchorRelativeIndexSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-anchor-relative-index-sign",
    title: "List Anchor Relative Index Sign Tool",
    description:
      "Calculate list anchor relative index sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { index: { type: "integer" }, anchor: { type: "integer" } },
      required: ["index", "anchor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distanceDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        sign: { type: "integer" },
      },
      required: ["distanceDecimal", "sign"],
    },
    ports: {
      inputs: [
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "anchor",
          label: "Anchor",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "distanceDecimal",
          label: "Distance Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        { id: "sign", label: "Sign", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = listAnchorRelativeIndexSignTool.execute;
export default listAnchorRelativeIndexSignTool;
