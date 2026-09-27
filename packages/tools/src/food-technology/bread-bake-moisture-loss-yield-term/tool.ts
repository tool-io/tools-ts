import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly doughMass: number;
  readonly initialMoisture: number;
  readonly finalMoisture: number;
  readonly otherDryLoss: number;
};
export type Output = {
  readonly retainedDryMass: number;
  readonly finalMass: number;
  readonly yieldFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    doughMass: { type: "number", exclusiveMinimum: 0 },
    initialMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    finalMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    otherDryLoss: { type: "number", minimum: 0 },
  },
  required: ["doughMass", "initialMoisture", "finalMoisture", "otherDryLoss"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedDryMass: { type: "number" },
    finalMass: { type: "number" },
    yieldFraction: { type: "number" },
  },
  required: ["retainedDryMass", "finalMass", "yieldFraction"],
} as const;
/** Calculate bread bake moisture loss yield term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { doughMass, initialMoisture, finalMoisture, otherDryLoss } = request;
  const compute = (): Output => {
    H.positive(doughMass);
    H.domain(
      initialMoisture >= 0 &&
        initialMoisture < 1 &&
        finalMoisture >= 0 &&
        finalMoisture < 1 &&
        otherDryLoss >= 0 &&
        otherDryLoss <= doughMass * (1 - initialMoisture),
    );
    return {
      retainedDryMass: doughMass * (1 - initialMoisture) - otherDryLoss,
      finalMass:
        (doughMass * (1 - initialMoisture) - otherDryLoss) /
        (1 - finalMoisture),
      yieldFraction:
        (doughMass * (1 - initialMoisture) - otherDryLoss) /
        (1 - finalMoisture) /
        doughMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    doughMass: 100,
    initialMoisture: 0.4,
    finalMoisture: 0.2,
    otherDryLoss: 0,
  },
  output: { retainedDryMass: 60, finalMass: 75, yieldFraction: 0.75 },
} satisfies ToolExample<Input, Output>;
export const breadBakeMoistureLossYieldTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/bread-bake-moisture-loss-yield-term",
    title: "Bread Bake Moisture Loss Yield Term Tool",
    description:
      "Calculate bread bake moisture loss yield term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        doughMass: { type: "number", exclusiveMinimum: 0 },
        initialMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        finalMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        otherDryLoss: { type: "number", minimum: 0 },
      },
      required: [
        "doughMass",
        "initialMoisture",
        "finalMoisture",
        "otherDryLoss",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedDryMass: { type: "number" },
        finalMass: { type: "number" },
        yieldFraction: { type: "number" },
      },
      required: ["retainedDryMass", "finalMass", "yieldFraction"],
    },
    ports: {
      inputs: [
        {
          id: "doughMass",
          label: "Dough Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialMoisture",
          label: "Initial Moisture",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalMoisture",
          label: "Final Moisture",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherDryLoss",
          label: "Other Dry Loss",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retainedDryMass",
          label: "Retained Dry Mass",
          valueType: { type: "number" },
        },
        { id: "finalMass", label: "Final Mass", valueType: { type: "number" } },
        {
          id: "yieldFraction",
          label: "Yield Fraction",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = breadBakeMoistureLossYieldTermTool.execute;
export default breadBakeMoistureLossYieldTermTool;
