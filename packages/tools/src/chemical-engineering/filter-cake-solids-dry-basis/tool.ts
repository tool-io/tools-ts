import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetCakeMass: number;
  readonly drySolidsMass: number;
};
export type Output = {
  readonly wetBasisSolidsFraction: number;
  readonly moisturePerDryMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetCakeMass: { type: "number", exclusiveMinimum: 0 },
    drySolidsMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wetCakeMass", "drySolidsMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetBasisSolidsFraction: { type: "number" },
    moisturePerDryMass: { type: "number" },
  },
  required: ["wetBasisSolidsFraction", "moisturePerDryMass"],
} as const;
/** Crosswalk measured wet-basis cake solids and moisture per dry mass without selecting a filtration model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetCakeMass, drySolidsMass } = request;
  const compute = (): Output => {
    (H.domain(wetCakeMass > 0, "wetCakeMass"), wetCakeMass);
    H.domain(
      drySolidsMass > 0 && drySolidsMass <= wetCakeMass,
      "drySolidsMass",
    );
    return {
      wetBasisSolidsFraction: drySolidsMass / wetCakeMass,
      moisturePerDryMass: (wetCakeMass - drySolidsMass) / drySolidsMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetCakeMass: 20, drySolidsMass: 5 },
  output: { wetBasisSolidsFraction: 0.25, moisturePerDryMass: 3 },
} satisfies ToolExample<Input, Output>;
export const filterCakeSolidsDryBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["chemical-engineering", "chemical engineering", "engineering"],
      keywords: ["chemical engineering", "engineering"],
    },
    id: "chemical-engineering/filter-cake-solids-dry-basis",
    title: "Filter Cake Solids Dry Basis",
    description:
      "Crosswalk measured wet-basis cake solids and moisture per dry mass without selecting a filtration model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetCakeMass: { type: "number", exclusiveMinimum: 0 },
        drySolidsMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wetCakeMass", "drySolidsMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetBasisSolidsFraction: { type: "number" },
        moisturePerDryMass: { type: "number" },
      },
      required: ["wetBasisSolidsFraction", "moisturePerDryMass"],
    },
    ports: {
      inputs: [
        {
          id: "wetCakeMass",
          label: "Wet Cake Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drySolidsMass",
          label: "Dry Solids Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wetBasisSolidsFraction",
          label: "Wet Basis Solids Fraction",
          valueType: { type: "number" },
        },
        {
          id: "moisturePerDryMass",
          label: "Moisture Per Dry Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = filterCakeSolidsDryBasisTool.execute;
export default filterCakeSolidsDryBasisTool;
