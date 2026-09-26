import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly powerPrice: number;
  readonly coalPrice: number;
  readonly fuelUnitsPerMwh: number;
  readonly emissionsPerMwh: number;
  readonly carbonPrice: number;
  readonly variableCost: number;
};
export type Output = {
  readonly fuelCost: number;
  readonly carbonCost: number;
  readonly cleanDarkSpread: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    powerPrice: { type: "number" },
    coalPrice: { type: "number" },
    fuelUnitsPerMwh: { type: "number", minimum: 0 },
    emissionsPerMwh: { type: "number", minimum: 0 },
    carbonPrice: { type: "number" },
    variableCost: { type: "number" },
  },
  required: [
    "powerPrice",
    "coalPrice",
    "fuelUnitsPerMwh",
    "emissionsPerMwh",
    "carbonPrice",
    "variableCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fuelCost: { type: "number" },
    carbonCost: { type: "number" },
    cleanDarkSpread: { type: "number" },
  },
  required: ["fuelCost", "carbonCost", "cleanDarkSpread"],
} as const;
/** Calculate dark spread emission cost term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    powerPrice,
    coalPrice,
    fuelUnitsPerMwh,
    emissionsPerMwh,
    carbonPrice,
    variableCost,
  } = request;
  const compute = (): Output => {
    H.domain(fuelUnitsPerMwh >= 0 && emissionsPerMwh >= 0);
    return {
      fuelCost: coalPrice * fuelUnitsPerMwh,
      carbonCost: emissionsPerMwh * carbonPrice,
      cleanDarkSpread:
        powerPrice -
        coalPrice * fuelUnitsPerMwh -
        emissionsPerMwh * carbonPrice -
        variableCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    powerPrice: 120,
    coalPrice: 20,
    fuelUnitsPerMwh: 2,
    emissionsPerMwh: 0.8,
    carbonPrice: 50,
    variableCost: 5,
  },
  output: { fuelCost: 40, carbonCost: 40, cleanDarkSpread: 35 },
} satisfies ToolExample<Input, Output>;
export const darkSpreadEmissionCostTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/dark-spread-emission-cost-term",
    title: "Dark Spread Emission Cost Term Tool",
    description:
      "Calculate dark spread emission cost term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        powerPrice: { type: "number" },
        coalPrice: { type: "number" },
        fuelUnitsPerMwh: { type: "number", minimum: 0 },
        emissionsPerMwh: { type: "number", minimum: 0 },
        carbonPrice: { type: "number" },
        variableCost: { type: "number" },
      },
      required: [
        "powerPrice",
        "coalPrice",
        "fuelUnitsPerMwh",
        "emissionsPerMwh",
        "carbonPrice",
        "variableCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fuelCost: { type: "number" },
        carbonCost: { type: "number" },
        cleanDarkSpread: { type: "number" },
      },
      required: ["fuelCost", "carbonCost", "cleanDarkSpread"],
    },
    ports: {
      inputs: [
        {
          id: "powerPrice",
          label: "Power Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coalPrice",
          label: "Coal Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fuelUnitsPerMwh",
          label: "Fuel Units Per Mwh",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "emissionsPerMwh",
          label: "Emissions Per Mwh",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "carbonPrice",
          label: "Carbon Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "variableCost",
          label: "Variable Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fuelCost", label: "Fuel Cost", valueType: { type: "number" } },
        {
          id: "carbonCost",
          label: "Carbon Cost",
          valueType: { type: "number" },
        },
        {
          id: "cleanDarkSpread",
          label: "Clean Dark Spread",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = darkSpreadEmissionCostTermTool.execute;
export default darkSpreadEmissionCostTermTool;
