import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly moisture: number;
  readonly dryEnergyPerMass: number;
  readonly suppliedEvaporationPenalty: number;
};
export type Output = { readonly dryEnergy: number; readonly netEnergy: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    moisture: { type: "number", minimum: 0, maximum: 1 },
    dryEnergyPerMass: { type: "number", minimum: 0 },
    suppliedEvaporationPenalty: { type: "number", minimum: 0 },
  },
  required: [
    "wetMass",
    "moisture",
    "dryEnergyPerMass",
    "suppliedEvaporationPenalty",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryEnergy: { type: "number" }, netEnergy: { type: "number" } },
  required: ["dryEnergy", "netEnergy"],
} as const;
/** Calculate farm biomass energy moisturebasis gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, moisture, dryEnergyPerMass, suppliedEvaporationPenalty } =
    request;
  const compute = (): Output => {
    H.domain(
      wetMass >= 0 && dryEnergyPerMass >= 0 && suppliedEvaporationPenalty >= 0,
    );
    H.probability(moisture);
    return {
      dryEnergy: wetMass * (1 - moisture) * dryEnergyPerMass,
      netEnergy:
        wetMass *
        ((1 - moisture) * dryEnergyPerMass -
          moisture * suppliedEvaporationPenalty),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    wetMass: 100,
    moisture: 0.2,
    dryEnergyPerMass: 10,
    suppliedEvaporationPenalty: 2,
  },
  output: { dryEnergy: 800, netEnergy: 760 },
} satisfies ToolExample<Input, Output>;
export const farmBiomassEnergyMoisturebasisGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/farm-biomass-energy-moisturebasis-gap",
    title: "Farm Biomass Energy Moisturebasis Gap Tool",
    description:
      "Calculate farm biomass energy moisturebasis gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        moisture: { type: "number", minimum: 0, maximum: 1 },
        dryEnergyPerMass: { type: "number", minimum: 0 },
        suppliedEvaporationPenalty: { type: "number", minimum: 0 },
      },
      required: [
        "wetMass",
        "moisture",
        "dryEnergyPerMass",
        "suppliedEvaporationPenalty",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryEnergy: { type: "number" },
        netEnergy: { type: "number" },
      },
      required: ["dryEnergy", "netEnergy"],
    },
    ports: {
      inputs: [
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moisture",
          label: "Moisture",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryEnergyPerMass",
          label: "Dry Energy Per Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedEvaporationPenalty",
          label: "Supplied Evaporation Penalty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryEnergy", label: "Dry Energy", valueType: { type: "number" } },
        { id: "netEnergy", label: "Net Energy", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmBiomassEnergyMoisturebasisGapTool.execute;
export default farmBiomassEnergyMoisturebasisGapTool;
