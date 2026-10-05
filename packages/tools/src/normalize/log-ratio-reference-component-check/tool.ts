import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly component: number; readonly reference: number };
export type Output = { readonly logRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    component: { type: "number", exclusiveMinimum: 0 },
    reference: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["component", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logRatio: { type: "number" } },
  required: ["logRatio"],
} as const;
/** Compute a natural log-ratio to one positive reference component, using separate logarithms to avoid quotient overflow. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { component, reference } = request;
  const compute = (): Output => {
    (H.domain(component > 0, "component"), component);
    (H.domain(reference > 0, "reference"), reference);
    return { logRatio: Math.log(component) - Math.log(reference) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { component: 8, reference: 2 },
  output: { logRatio: 1.3862943611198904 },
} satisfies ToolExample<Input, Output>;
export const logRatioReferenceComponentCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/log-ratio-reference-component-check",
    title: "Log Ratio Reference Component Check Tool",
    description:
      "Compute a natural log-ratio to one positive reference component, using separate logarithms to avoid quotient overflow.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        component: { type: "number", exclusiveMinimum: 0 },
        reference: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["component", "reference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { logRatio: { type: "number" } },
      required: ["logRatio"],
    },
    ports: {
      inputs: [
        {
          id: "component",
          label: "Component",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logRatio", label: "Log Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = logRatioReferenceComponentCheckTool.execute;
export default logRatioReferenceComponentCheckTool;
