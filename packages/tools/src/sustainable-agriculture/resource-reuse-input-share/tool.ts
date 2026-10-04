import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reused: number; readonly total: number };
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reused: { type: "number", minimum: 0 },
    total: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reused", "total"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate resource reuse input share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reused, total } = request;
  const compute = (): Output => {
    H.positive(total);
    H.domain(reused >= 0 && reused <= total);
    return { share: reused / total };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reused: 3, total: 12 },
  output: { share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const resourceReuseInputShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/resource-reuse-input-share",
    title: "Resource Reuse Input Share Tool",
    description:
      "Calculate resource reuse input share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reused: { type: "number", minimum: 0 },
        total: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["reused", "total"],
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
          id: "reused",
          label: "Reused",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = resourceReuseInputShareTool.execute;
export default resourceReuseInputShareTool;
