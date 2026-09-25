import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstQuantum: number;
  readonly secondQuantum: number;
  readonly firstServingMass: number;
  readonly secondServingMass: number;
};
export type Output = {
  readonly firstPerMassQuantum: number;
  readonly secondPerMassQuantum: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstQuantum: { type: "number", exclusiveMinimum: 0 },
    secondQuantum: { type: "number", exclusiveMinimum: 0 },
    firstServingMass: { type: "number", exclusiveMinimum: 0 },
    secondServingMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstQuantum",
    "secondQuantum",
    "firstServingMass",
    "secondServingMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPerMassQuantum: { type: "number" },
    secondPerMassQuantum: { type: "number" },
    gap: { type: "number" },
  },
  required: ["firstPerMassQuantum", "secondPerMassQuantum", "gap"],
} as const;
/** Calculate nutrient label resolution gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstQuantum, secondQuantum, firstServingMass, secondServingMass } =
    request;
  const compute = (): Output => {
    H.positive(firstQuantum);
    H.positive(secondQuantum);
    H.positive(firstServingMass);
    H.positive(secondServingMass);
    return {
      firstPerMassQuantum: firstQuantum / firstServingMass,
      secondPerMassQuantum: secondQuantum / secondServingMass,
      gap: firstQuantum / firstServingMass - secondQuantum / secondServingMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstQuantum: 1,
    secondQuantum: 2,
    firstServingMass: 100,
    secondServingMass: 100,
  },
  output: { firstPerMassQuantum: 0.01, secondPerMassQuantum: 0.02, gap: -0.01 },
} satisfies ToolExample<Input, Output>;
export const nutrientLabelResolutionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/nutrient-label-resolution-gap",
    title: "Nutrient Label Resolution Gap Tool",
    description:
      "Calculate nutrient label resolution gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstQuantum: { type: "number", exclusiveMinimum: 0 },
        secondQuantum: { type: "number", exclusiveMinimum: 0 },
        firstServingMass: { type: "number", exclusiveMinimum: 0 },
        secondServingMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstQuantum",
        "secondQuantum",
        "firstServingMass",
        "secondServingMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPerMassQuantum: { type: "number" },
        secondPerMassQuantum: { type: "number" },
        gap: { type: "number" },
      },
      required: ["firstPerMassQuantum", "secondPerMassQuantum", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "firstQuantum",
          label: "First Quantum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondQuantum",
          label: "Second Quantum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstServingMass",
          label: "First Serving Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondServingMass",
          label: "Second Serving Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstPerMassQuantum",
          label: "First Per Mass Quantum",
          valueType: { type: "number" },
        },
        {
          id: "secondPerMassQuantum",
          label: "Second Per Mass Quantum",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = nutrientLabelResolutionGapTool.execute;
export default nutrientLabelResolutionGapTool;
