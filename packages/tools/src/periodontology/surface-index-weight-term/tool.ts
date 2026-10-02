import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surfaceValue: number;
  readonly suppliedWeight: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surfaceValue: { type: "number" },
    suppliedWeight: { type: "number", minimum: 0 },
  },
  required: ["surfaceValue", "suppliedWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Return one explicitly weighted research annotation term; no clinical surface-index weights are bundled. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surfaceValue, suppliedWeight } = request;
  const compute = (): Output => {
    H.domain(suppliedWeight >= 0);
    return { contribution: surfaceValue * suppliedWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { surfaceValue: 2, suppliedWeight: 0.5 },
  output: { contribution: 1 },
} satisfies ToolExample<Input, Output>;
export const surfaceIndexWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "periodontology/surface-index-weight-term",
    title: "Surface Index Weight Term Tool",
    description:
      "Return one explicitly weighted research annotation term; no clinical surface-index weights are bundled.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surfaceValue: { type: "number" },
        suppliedWeight: { type: "number", minimum: 0 },
      },
      required: ["surfaceValue", "suppliedWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "surfaceValue",
          label: "Surface Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWeight",
          label: "Supplied Weight",
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
      ],
    },
  },
  calculate,
});
export const run = surfaceIndexWeightTermTool.execute;
export default surfaceIndexWeightTermTool;
