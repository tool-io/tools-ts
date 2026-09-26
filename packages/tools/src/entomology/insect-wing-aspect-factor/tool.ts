import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly span: number; readonly wingArea: number };
export type Output = { readonly aspectFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    span: { type: "number", minimum: 0 },
    wingArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["span", "wingArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { aspectFactor: { type: "number" } },
  required: ["aspectFactor"],
} as const;
/** Calculate insect wing aspect factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { span, wingArea } = request;
  const compute = (): Output => {
    H.domain(span >= 0);
    H.positive(wingArea);
    return { aspectFactor: span ** 2 / wingArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { span: 4, wingArea: 2 },
  output: { aspectFactor: 8 },
} satisfies ToolExample<Input, Output>;
export const insectWingAspectFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/insect-wing-aspect-factor",
    title: "Insect Wing Aspect Factor Tool",
    description:
      "Calculate insect wing aspect factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        span: { type: "number", minimum: 0 },
        wingArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["span", "wingArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { aspectFactor: { type: "number" } },
      required: ["aspectFactor"],
    },
    ports: {
      inputs: [
        {
          id: "span",
          label: "Span",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wingArea",
          label: "Wing Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "aspectFactor",
          label: "Aspect Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insectWingAspectFactorTool.execute;
export default insectWingAspectFactorTool;
