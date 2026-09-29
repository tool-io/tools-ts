import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reusedMass: number; readonly totalMass: number };
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reusedMass: { type: "number", minimum: 0 },
    totalMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reusedMass", "totalMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate part reuse mass share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reusedMass, totalMass } = request;
  const compute = (): Output => {
    H.positive(totalMass);
    H.domain(reusedMass >= 0 && reusedMass <= totalMass);
    return { share: reusedMass / totalMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reusedMass: 3, totalMass: 12 },
  output: { share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const partReuseMassShareTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "industrial-design/part-reuse-mass-share",
    title: "Part Reuse Mass Share Tool",
    description:
      "Calculate part reuse mass share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reusedMass: { type: "number", minimum: 0 },
        totalMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["reusedMass", "totalMass"],
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
          id: "reusedMass",
          label: "Reused Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalMass",
          label: "Total Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = partReuseMassShareTool.execute;
export default partReuseMassShareTool;
