import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialMass: number;
  readonly initialMoisture: number;
  readonly finalMoisture: number;
};
export type Output = {
  readonly finalMass: number;
  readonly removedWater: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialMass: { type: "number", minimum: 0 },
    initialMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    finalMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["initialMass", "initialMoisture", "finalMoisture"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finalMass: { type: "number" },
    removedWater: { type: "number" },
  },
  required: ["finalMass", "removedWater"],
} as const;
/** Mass-conserving supplied moisture-basis bookkeeping, without drying instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialMass, initialMoisture, finalMoisture } = request;
  const compute = (): Output => {
    H.domain(
      initialMass >= 0 &&
        initialMoisture >= 0 &&
        initialMoisture < 1 &&
        finalMoisture >= 0 &&
        finalMoisture < 1,
    );
    return {
      finalMass: (initialMass * (1 - initialMoisture)) / (1 - finalMoisture),
      removedWater:
        initialMass -
        (initialMass * (1 - initialMoisture)) / (1 - finalMoisture),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialMass: 1000, initialMoisture: 0.2, finalMoisture: 0.1 },
  output: { finalMass: 888.8888888888889, removedWater: 111.11111111111109 },
} satisfies ToolExample<Input, Output>;
export const grainDryerMoistureMassBalanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/grain-dryer-moisture-mass-balance-term",
    title: "Grain Dryer Moisture Mass Balance Term Tool",
    description:
      "Mass-conserving supplied moisture-basis bookkeeping, without drying instructions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialMass: { type: "number", minimum: 0 },
        initialMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        finalMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["initialMass", "initialMoisture", "finalMoisture"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        finalMass: { type: "number" },
        removedWater: { type: "number" },
      },
      required: ["finalMass", "removedWater"],
    },
    ports: {
      inputs: [
        {
          id: "initialMass",
          label: "Initial Mass",
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
      ],
      outputs: [
        { id: "finalMass", label: "Final Mass", valueType: { type: "number" } },
        {
          id: "removedWater",
          label: "Removed Water",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = grainDryerMoistureMassBalanceTermTool.execute;
export default grainDryerMoistureMassBalanceTermTool;
