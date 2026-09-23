import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly waterFraction: number;
  readonly suppliedConcentration: number;
  readonly concentrationIsDryBasis: boolean;
};
export type Output = { readonly dryMass: number; readonly impliedLoad: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    waterFraction: { type: "number", minimum: 0, maximum: 1 },
    suppliedConcentration: { type: "number" },
    concentrationIsDryBasis: { type: "boolean" },
  },
  required: [
    "wetMass",
    "waterFraction",
    "suppliedConcentration",
    "concentrationIsDryBasis",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryMass: { type: "number" }, impliedLoad: { type: "number" } },
  required: ["dryMass", "impliedLoad"],
} as const;
/** Use an explicit wet/dry mass basis for a supplied signed concentration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    wetMass,
    waterFraction,
    suppliedConcentration,
    concentrationIsDryBasis,
  } = request;
  const compute = (): Output => {
    H.domain(wetMass >= 0);
    H.probability(waterFraction);
    return {
      dryMass: wetMass * (1 - waterFraction),
      impliedLoad:
        wetMass *
        (concentrationIsDryBasis ? 1 - waterFraction : 1) *
        suppliedConcentration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    wetMass: 100,
    waterFraction: 0.2,
    suppliedConcentration: 3,
    concentrationIsDryBasis: true,
  },
  output: { dryMass: 80, impliedLoad: 240 },
} satisfies ToolExample<Input, Output>;
export const moistureCorrectedLoadBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/moisture-corrected-load-base-flag",
    title: "Moisture Corrected Load Base Flag Tool",
    description:
      "Use an explicit wet/dry mass basis for a supplied signed concentration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        waterFraction: { type: "number", minimum: 0, maximum: 1 },
        suppliedConcentration: { type: "number" },
        concentrationIsDryBasis: { type: "boolean" },
      },
      required: [
        "wetMass",
        "waterFraction",
        "suppliedConcentration",
        "concentrationIsDryBasis",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number" },
        impliedLoad: { type: "number" },
      },
      required: ["dryMass", "impliedLoad"],
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
          id: "waterFraction",
          label: "Water Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedConcentration",
          label: "Supplied Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "concentrationIsDryBasis",
          label: "Concentration Is Dry Basis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
        {
          id: "impliedLoad",
          label: "Implied Load",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = moistureCorrectedLoadBaseFlagTool.execute;
export default moistureCorrectedLoadBaseFlagTool;
