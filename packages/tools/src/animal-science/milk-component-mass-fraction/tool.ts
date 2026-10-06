import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly milkMassKg: number;
  readonly componentPercent: number;
};
export type Output = { readonly componentMassKg: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    milkMassKg: { type: "number", minimum: 0 },
    componentPercent: { type: "number", minimum: 0, maximum: 100 },
  },
  required: ["milkMassKg", "componentPercent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { componentMassKg: { type: "number" } },
  required: ["componentMassKg"],
} as const;
/** Convert a supplied milk-component mass percentage into component mass for an explicit milk mass. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { milkMassKg, componentPercent } = request;
  const compute = (): Output => {
    H.domain(
      milkMassKg >= 0 && componentPercent >= 0 && componentPercent <= 100,
      "milkMassKg",
    );
    return { componentMassKg: (milkMassKg * componentPercent) / 100 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { milkMassKg: 100, componentPercent: 3.5 },
  output: { componentMassKg: 3.5 },
} satisfies ToolExample<Input, Output>;
export const milkComponentMassFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["animal-science", "animal science", "agriculture"],
      keywords: ["animal science", "agriculture"],
    },
    id: "animal-science/milk-component-mass-fraction",
    title: "Milk Component Mass Fraction",
    description:
      "Convert a supplied milk-component mass percentage into component mass for an explicit milk mass.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        milkMassKg: { type: "number", minimum: 0 },
        componentPercent: { type: "number", minimum: 0, maximum: 100 },
      },
      required: ["milkMassKg", "componentPercent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { componentMassKg: { type: "number" } },
      required: ["componentMassKg"],
    },
    ports: {
      inputs: [
        {
          id: "milkMassKg",
          label: "Milk Mass Kg",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "componentPercent",
          label: "Component Percent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "componentMassKg",
          label: "Component Mass Kg",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = milkComponentMassFractionTool.execute;
export default milkComponentMassFractionTool;
