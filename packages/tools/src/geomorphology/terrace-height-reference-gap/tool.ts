import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredHeight: number;
  readonly suppliedReferenceHeight: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredHeight: { type: "number" },
    suppliedReferenceHeight: { type: "number" },
  },
  required: ["measuredHeight", "suppliedReferenceHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Calculate terrace height reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredHeight, suppliedReferenceHeight } = request;
  const compute = (): Output => {
    return { gap: measuredHeight - suppliedReferenceHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredHeight: 12, suppliedReferenceHeight: 10 },
  output: { gap: 2 },
} satisfies ToolExample<Input, Output>;
export const terraceHeightReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/terrace-height-reference-gap",
    title: "Terrace Height Reference Gap Tool",
    description:
      "Calculate terrace height reference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredHeight: { type: "number" },
        suppliedReferenceHeight: { type: "number" },
      },
      required: ["measuredHeight", "suppliedReferenceHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "measuredHeight",
          label: "Measured Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceHeight",
          label: "Supplied Reference Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = terraceHeightReferenceGapTool.execute;
export default terraceHeightReferenceGapTool;
