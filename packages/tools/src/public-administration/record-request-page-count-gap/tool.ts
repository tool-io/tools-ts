import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly estimated: number; readonly supplied: number };
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimated: { type: "integer", minimum: 0 },
    supplied: { type: "integer", minimum: 0 },
  },
  required: ["estimated", "supplied"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "integer" } },
  required: ["gap"],
} as const;
/** Calculate record request page count gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { estimated, supplied } = request;
  const compute = (): Output => {
    H.integer(estimated, 0);
    H.integer(supplied, 0);
    return { gap: supplied - estimated };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { estimated: 80, supplied: 100 },
  output: { gap: 20 },
} satisfies ToolExample<Input, Output>;
export const recordRequestPageCountGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/record-request-page-count-gap",
    title: "Record Request Page Count Gap Tool",
    description:
      "Calculate record request page count gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimated: { type: "integer", minimum: 0 },
        supplied: { type: "integer", minimum: 0 },
      },
      required: ["estimated", "supplied"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "integer" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "estimated",
          label: "Estimated",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "supplied",
          label: "Supplied",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = recordRequestPageCountGapTool.execute;
export default recordRequestPageCountGapTool;
