import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly source: number;
  readonly spacing: number;
  readonly coefficient: number;
};
export type Output = { readonly scaledSource: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: { type: "number" },
    spacing: { type: "number", exclusiveMinimum: 0 },
    coefficient: { type: "number" },
  },
  required: ["source", "spacing", "coefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scaledSource: { type: "number" } },
  required: ["scaledSource"],
} as const;
/** Source contribution h squared*f/coefficient for the convention coefficient*Laplacian(u)=f. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { source, spacing, coefficient } = request;
  const compute = (): Output => {
    H.positive(spacing);
    H.domain(coefficient !== 0);
    return { scaledSource: (source * spacing ** 2) / coefficient };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { source: 3, spacing: 0.5, coefficient: 2 },
  output: { scaledSource: 0.375 },
} satisfies ToolExample<Input, Output>;
export const poissonStencilOneSourceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/poisson-stencil-one-source-term",
    title: "Poisson Stencil One Source Term Tool",
    description:
      "Source contribution h squared*f/coefficient for the convention coefficient*Laplacian(u)=f.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        source: { type: "number" },
        spacing: { type: "number", exclusiveMinimum: 0 },
        coefficient: { type: "number" },
      },
      required: ["source", "spacing", "coefficient"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scaledSource: { type: "number" } },
      required: ["scaledSource"],
    },
    ports: {
      inputs: [
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spacing",
          label: "Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaledSource",
          label: "Scaled Source",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = poissonStencilOneSourceTermTool.execute;
export default poissonStencilOneSourceTermTool;
