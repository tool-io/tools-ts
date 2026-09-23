import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly partialX: number; readonly partialY: number };
export type Output = { readonly integrand: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { partialX: { type: "number" }, partialY: { type: "number" } },
  required: ["partialX", "partialY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { integrand: { type: "number" } },
  required: ["integrand"],
} as const;
/** Calculate graph surface area integrand from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { partialX, partialY } = input;
  const compute = (): Output => {
    return { integrand: Math.hypot(1, partialX, partialY) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { partialX: 2, partialY: 2 },
  output: { integrand: 3 },
} satisfies ToolExample<Input, Output>;
export const graphSurfaceAreaIntegrandTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/graph-surface-area-integrand",
    title: "Graph Surface Area Integrand Tool",
    description:
      "Calculate graph surface area integrand from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        partialX: { type: "number" },
        partialY: { type: "number" },
      },
      required: ["partialX", "partialY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { integrand: { type: "number" } },
      required: ["integrand"],
    },
    ports: {
      inputs: [
        {
          id: "partialX",
          label: "Partial X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "partialY",
          label: "Partial Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "integrand", label: "Integrand", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = graphSurfaceAreaIntegrandTool.execute;
export default graphSurfaceAreaIntegrandTool;
