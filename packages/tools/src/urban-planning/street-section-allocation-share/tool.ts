import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allocatedWidth: number;
  readonly totalWidth: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedWidth: { type: "number", minimum: 0 },
    totalWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["allocatedWidth", "totalWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate street section allocation share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allocatedWidth, totalWidth } = request;
  const compute = (): Output => {
    H.positive(totalWidth);
    H.domain(allocatedWidth >= 0 && allocatedWidth <= totalWidth);
    return { share: allocatedWidth / totalWidth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allocatedWidth: 3, totalWidth: 12 },
  output: { share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const streetSectionAllocationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/street-section-allocation-share",
    title: "Street Section Allocation Share Tool",
    description:
      "Calculate street section allocation share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedWidth: { type: "number", minimum: 0 },
        totalWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["allocatedWidth", "totalWidth"],
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
          id: "allocatedWidth",
          label: "Allocated Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWidth",
          label: "Total Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = streetSectionAllocationShareTool.execute;
export default streetSectionAllocationShareTool;
