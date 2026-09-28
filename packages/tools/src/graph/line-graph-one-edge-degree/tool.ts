import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceDegree: number;
  readonly targetDegree: number;
};
export type Output = { readonly degree: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceDegree: { type: "integer", minimum: 1 },
    targetDegree: { type: "integer", minimum: 1 },
  },
  required: ["sourceDegree", "targetDegree"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { degree: { type: "integer" } },
  required: ["degree"],
} as const;
/** Return an edge vertex degree in the line graph of a simple loopless graph. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceDegree, targetDegree } = request;
  const compute = (): Output => {
    H.integer(sourceDegree, 1);
    H.integer(targetDegree, 1);
    return { degree: sourceDegree + targetDegree - 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceDegree: 3, targetDegree: 4 },
  output: { degree: 5 },
} satisfies ToolExample<Input, Output>;
export const lineGraphOneEdgeDegreeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/line-graph-one-edge-degree",
    title: "Line Graph One Edge Degree Tool",
    description:
      "Return an edge vertex degree in the line graph of a simple loopless graph.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceDegree: { type: "integer", minimum: 1 },
        targetDegree: { type: "integer", minimum: 1 },
      },
      required: ["sourceDegree", "targetDegree"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { degree: { type: "integer" } },
      required: ["degree"],
    },
    ports: {
      inputs: [
        {
          id: "sourceDegree",
          label: "Source Degree",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetDegree",
          label: "Target Degree",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "degree", label: "Degree", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = lineGraphOneEdgeDegreeTool.execute;
export default lineGraphOneEdgeDegreeTool;
