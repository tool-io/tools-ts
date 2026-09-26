import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemPoints: number;
  readonly totalAvailable: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemPoints: { type: "number", minimum: 0 },
    totalAvailable: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["itemPoints", "totalAvailable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate rubric item point share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemPoints, totalAvailable } = request;
  const compute = (): Output => {
    H.positive(totalAvailable);
    H.domain(itemPoints >= 0 && itemPoints <= totalAvailable);
    return { share: itemPoints / totalAvailable };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemPoints: 6, totalAvailable: 20 },
  output: { share: 0.3 },
} satisfies ToolExample<Input, Output>;
export const rubricItemPointShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/rubric-item-point-share",
    title: "Rubric Item Point Share Tool",
    description:
      "Calculate rubric item point share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemPoints: { type: "number", minimum: 0 },
        totalAvailable: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["itemPoints", "totalAvailable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "itemPoints",
          label: "Item Points",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalAvailable",
          label: "Total Available",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = rubricItemPointShareTool.execute;
export default rubricItemPointShareTool;
