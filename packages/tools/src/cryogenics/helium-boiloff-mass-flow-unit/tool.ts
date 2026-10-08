import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly massKilograms: number;
  readonly elapsedHours: number;
};
export type Output = {
  readonly kilogramsPerHour: number;
  readonly gramsPerSecond: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massKilograms: { type: "number", minimum: 0 },
    elapsedHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["massKilograms", "elapsedHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kilogramsPerHour: { type: "number" },
    gramsPerSecond: { type: "number" },
  },
  required: ["kilogramsPerHour", "gramsPerSecond"],
} as const;
/** Convert supplied helium boil-off mass over positive elapsed hours to kilograms per hour and grams per second without using a helium property table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { massKilograms, elapsedHours } = request;
  const compute = (): Output => {
    H.domain(massKilograms >= 0, "massKilograms");
    (H.domain(
      Number.isFinite(elapsedHours) && elapsedHours > 0,
      "elapsedHours",
    ),
      elapsedHours);
    return {
      kilogramsPerHour: massKilograms / elapsedHours,
      gramsPerSecond: massKilograms / elapsedHours / 3.6,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { massKilograms: 3.6, elapsedHours: 1 },
  output: { kilogramsPerHour: 3.6, gramsPerSecond: 1 },
} satisfies ToolExample<Input, Output>;
export const heliumBoiloffMassFlowUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cryogenics", "physics"],
      keywords: ["cryogenics", "physics"],
    },
    id: "cryogenics/helium-boiloff-mass-flow-unit",
    title: "Helium Boiloff Mass Flow Unit",
    description:
      "Convert supplied helium boil-off mass over positive elapsed hours to kilograms per hour and grams per second without using a helium property table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massKilograms: { type: "number", minimum: 0 },
        elapsedHours: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["massKilograms", "elapsedHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        kilogramsPerHour: { type: "number" },
        gramsPerSecond: { type: "number" },
      },
      required: ["kilogramsPerHour", "gramsPerSecond"],
    },
    ports: {
      inputs: [
        {
          id: "massKilograms",
          label: "Mass Kilograms",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedHours",
          label: "Elapsed Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "kilogramsPerHour",
          label: "Kilograms Per Hour",
          valueType: { type: "number" },
        },
        {
          id: "gramsPerSecond",
          label: "Grams Per Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = heliumBoiloffMassFlowUnitTool.execute;
export default heliumBoiloffMassFlowUnitTool;
