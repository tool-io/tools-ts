import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly componentMoles: number;
  readonly totalMoles: number;
};
export type Output = { readonly moleFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentMoles: { type: "number", minimum: 0 },
    totalMoles: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["componentMoles", "totalMoles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { moleFraction: { type: "number" } },
  required: ["moleFraction"],
} as const;
/** Calculate stream component mole share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { componentMoles, totalMoles } = request;
  const compute = (): Output => {
    H.positive(totalMoles);
    H.domain(componentMoles >= 0 && componentMoles <= totalMoles);
    return { moleFraction: componentMoles / totalMoles };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { componentMoles: 2, totalMoles: 8 },
  output: { moleFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const streamComponentMoleShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/stream-component-mole-share",
    title: "Stream Component Mole Share Tool",
    description:
      "Calculate stream component mole share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentMoles: { type: "number", minimum: 0 },
        totalMoles: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["componentMoles", "totalMoles"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { moleFraction: { type: "number" } },
      required: ["moleFraction"],
    },
    ports: {
      inputs: [
        {
          id: "componentMoles",
          label: "Component Moles",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalMoles",
          label: "Total Moles",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "moleFraction",
          label: "Mole Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = streamComponentMoleShareTool.execute;
export default streamComponentMoleShareTool;
