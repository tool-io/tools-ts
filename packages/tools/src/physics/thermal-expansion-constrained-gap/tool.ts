import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialGap: number;
  readonly length: number;
  readonly coefficient: number;
  readonly temperatureChange: number;
};
export type Output = {
  readonly gap: number;
  readonly closure: number;
  readonly closed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialGap: { type: "number" },
    length: { type: "number", minimum: 0 },
    coefficient: { type: "number" },
    temperatureChange: { type: "number" },
  },
  required: ["initialGap", "length", "coefficient", "temperatureChange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gap: { type: "number" },
    closure: { type: "number" },
    closed: { type: "boolean" },
  },
  required: ["gap", "closure", "closed"],
} as const;
/** Apply one linear free-expansion displacement to an explicit gap; negative output is interference, not structural approval. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { initialGap, length, coefficient, temperatureChange } = input;
  const compute = (): Output => {
    H.domain(length >= 0);
    const closure = length * coefficient * temperatureChange,
      gap = initialGap - closure;
    return { gap, closure, closed: gap <= 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    initialGap: 3,
    length: 1000,
    coefficient: 0.001,
    temperatureChange: 2,
  },
  output: { gap: 1, closure: 2, closed: false },
} satisfies ToolExample<Input, Output>;
export const thermalExpansionConstrainedGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/thermal-expansion-constrained-gap",
    title: "Thermal Expansion Constrained Gap Tool",
    description:
      "Apply one linear free-expansion displacement to an explicit gap; negative output is interference, not structural approval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialGap: { type: "number" },
        length: { type: "number", minimum: 0 },
        coefficient: { type: "number" },
        temperatureChange: { type: "number" },
      },
      required: ["initialGap", "length", "coefficient", "temperatureChange"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "number" },
        closure: { type: "number" },
        closed: { type: "boolean" },
      },
      required: ["gap", "closure", "closed"],
    },
    ports: {
      inputs: [
        {
          id: "initialGap",
          label: "Initial Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperatureChange",
          label: "Temperature Change",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "closure", label: "Closure", valueType: { type: "number" } },
        { id: "closed", label: "Closed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = thermalExpansionConstrainedGapTool.execute;
export default thermalExpansionConstrainedGapTool;
