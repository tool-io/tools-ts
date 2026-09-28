import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly eccentricity: number; readonly radius: number };
export type Output = { readonly gap: number; readonly center: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eccentricity: { type: "integer" },
    radius: { type: "integer", minimum: 0 },
  },
  required: ["eccentricity", "radius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "integer" }, center: { type: "boolean" } },
  required: ["gap", "center"],
} as const;
/** Calculate tree center eccentricity explicit gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eccentricity, radius } = request;
  const compute = (): Output => {
    H.integer(radius, 0);
    H.integer(eccentricity, radius);
    const gap = eccentricity - radius;
    return { gap, center: gap === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eccentricity: 4, radius: 3 },
  output: { gap: 1, center: false },
} satisfies ToolExample<Input, Output>;
export const treeCenterEccentricityExplicitGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/tree-center-eccentricity-explicit-gap",
    title: "Tree Center Eccentricity Explicit Gap Tool",
    description:
      "Calculate tree center eccentricity explicit gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eccentricity: { type: "integer" },
        radius: { type: "integer", minimum: 0 },
      },
      required: ["eccentricity", "radius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "integer" }, center: { type: "boolean" } },
      required: ["gap", "center"],
    },
    ports: {
      inputs: [
        {
          id: "eccentricity",
          label: "Eccentricity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
        { id: "center", label: "Center", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = treeCenterEccentricityExplicitGapTool.execute;
export default treeCenterEccentricityExplicitGapTool;
