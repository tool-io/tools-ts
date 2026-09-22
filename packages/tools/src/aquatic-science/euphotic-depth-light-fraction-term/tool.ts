import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly extinction: number;
  readonly lightFraction: number;
};
export type Output = { readonly depth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extinction: { type: "number", exclusiveMinimum: 0 },
    lightFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["extinction", "lightFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { depth: { type: "number" } },
  required: ["depth"],
} as const;
/** Calculate euphotic depth light fraction term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { extinction, lightFraction } = request;
  const compute = (): Output => {
    H.positive(extinction);
    H.domain(lightFraction > 0 && lightFraction <= 1);
    return { depth: -Math.log(lightFraction) / extinction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { extinction: 0.5, lightFraction: 0.01 },
  output: { depth: 9.210340371976182 },
} satisfies ToolExample<Input, Output>;
export const euphoticDepthLightFractionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/euphotic-depth-light-fraction-term",
    title: "Euphotic Depth Light Fraction Term Tool",
    description:
      "Calculate euphotic depth light fraction term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        extinction: { type: "number", exclusiveMinimum: 0 },
        lightFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["extinction", "lightFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { depth: { type: "number" } },
      required: ["depth"],
    },
    ports: {
      inputs: [
        {
          id: "extinction",
          label: "Extinction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lightFraction",
          label: "Light Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "depth", label: "Depth", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = euphoticDepthLightFractionTermTool.execute;
export default euphoticDepthLightFractionTermTool;
