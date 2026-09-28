import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly sides: number };
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sides: { type: "integer", minimum: 3, maximum: 1000000 } },
  required: ["sides"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Compute regular polygon apothem radius ratio from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { sides } = input;
  const compute = (): Output => {
    integer(sides, 3, 1000000);
    return { ratio: Math.cos(Math.PI / sides) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { sides: 3 },
  output: { ratio: 0.5000000000000001 },
} satisfies ToolExample<Input, Output>;
export const regularPolygonApothemRadiusRatioTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geometry/regular-polygon-apothem-radius-ratio",
  title: "Regular Polygon Apothem Radius Ratio Tool",
  description:
    "Compute regular polygon apothem radius ratio from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "sides",
        label: "Sides",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
  },
});
export const run = regularPolygonApothemRadiusRatioTool.execute;
export default regularPolygonApothemRadiusRatioTool;
