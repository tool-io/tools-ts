import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly streamMassRate: number;
  readonly componentMassFraction: number;
};
export type Output = { readonly componentMassRate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    streamMassRate: { type: "number", minimum: 0 },
    componentMassFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["streamMassRate", "componentMassFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { componentMassRate: { type: "number" } },
  required: ["componentMassRate"],
} as const;
/** Calculate one component’s mass-flow contribution from a supplied total mass rate and mass fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { streamMassRate, componentMassFraction } = request;
  const compute = (): Output => {
    H.domain(streamMassRate >= 0, "streamMassRate");
    (H.domain(
      componentMassFraction >= 0 && componentMassFraction <= 1,
      "componentMassFraction",
    ),
      componentMassFraction);
    return { componentMassRate: streamMassRate * componentMassFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { streamMassRate: 100, componentMassFraction: 0.2 },
  output: { componentMassRate: 20 },
} satisfies ToolExample<Input, Output>;
export const processStreamComponentMassTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["chemical-engineering", "chemical engineering", "engineering"],
      keywords: ["chemical engineering", "engineering"],
    },
    id: "chemical-engineering/process-stream-component-mass-term",
    title: "Process Stream Component Mass Term",
    description:
      "Calculate one component’s mass-flow contribution from a supplied total mass rate and mass fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        streamMassRate: { type: "number", minimum: 0 },
        componentMassFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["streamMassRate", "componentMassFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { componentMassRate: { type: "number" } },
      required: ["componentMassRate"],
    },
    ports: {
      inputs: [
        {
          id: "streamMassRate",
          label: "Stream Mass Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "componentMassFraction",
          label: "Component Mass Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "componentMassRate",
          label: "Component Mass Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = processStreamComponentMassTermTool.execute;
export default processStreamComponentMassTermTool;
