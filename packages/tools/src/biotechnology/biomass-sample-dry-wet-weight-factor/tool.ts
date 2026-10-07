import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly measuredDryMass: number;
};
export type Output = {
  readonly dryMatterFraction: number;
  readonly wetToDryMassFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", exclusiveMinimum: 0 },
    measuredDryMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wetMass", "measuredDryMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMatterFraction: { type: "number" },
    wetToDryMassFactor: { type: "number" },
  },
  required: ["dryMatterFraction", "wetToDryMassFactor"],
} as const;
/** Compare explicit wet and measured dry biomass sample masses without estimating culture yield. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, measuredDryMass } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(wetMass) && wetMass > 0, "wetMass"), wetMass);
    H.domain(
      measuredDryMass > 0 && measuredDryMass <= wetMass,
      "measuredDryMass",
    );
    return {
      dryMatterFraction: measuredDryMass / wetMass,
      wetToDryMassFactor: wetMass / measuredDryMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 20, measuredDryMass: 5 },
  output: { dryMatterFraction: 0.25, wetToDryMassFactor: 4 },
} satisfies ToolExample<Input, Output>;
export const biomassSampleDryWetWeightFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biotechnology", "biology"],
      keywords: ["biotechnology", "biology"],
    },
    id: "biotechnology/biomass-sample-dry-wet-weight-factor",
    title: "Biomass Sample Dry Wet Weight Factor",
    description:
      "Compare explicit wet and measured dry biomass sample masses without estimating culture yield.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", exclusiveMinimum: 0 },
        measuredDryMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wetMass", "measuredDryMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMatterFraction: { type: "number" },
        wetToDryMassFactor: { type: "number" },
      },
      required: ["dryMatterFraction", "wetToDryMassFactor"],
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
          id: "measuredDryMass",
          label: "Measured Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dryMatterFraction",
          label: "Dry Matter Fraction",
          valueType: { type: "number" },
        },
        {
          id: "wetToDryMassFactor",
          label: "Wet To Dry Mass Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biomassSampleDryWetWeightFactorTool.execute;
export default biomassSampleDryWetWeightFactorTool;
