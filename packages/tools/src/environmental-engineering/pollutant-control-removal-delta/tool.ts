import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly inletMass: number; readonly outletMass: number };
export type Output = {
  readonly removedMass: number;
  readonly removalFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inletMass: { type: "number", exclusiveMinimum: 0 },
    outletMass: { type: "number", minimum: 0 },
  },
  required: ["inletMass", "outletMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    removedMass: { type: "number" },
    removalFraction: { type: "number" },
  },
  required: ["removedMass", "removalFraction"],
} as const;
/** Compare compatible inlet and outlet pollutant masses, preserving negative apparent removal when outlet mass is larger. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inletMass, outletMass } = request;
  const compute = (): Output => {
    (H.domain(inletMass > 0, "inletMass"), inletMass);
    H.domain(outletMass >= 0, "outletMass");
    return {
      removedMass: inletMass - outletMass,
      removalFraction: (inletMass - outletMass) / inletMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inletMass: 50, outletMass: 5 },
  output: { removedMass: 45, removalFraction: 0.9 },
} satisfies ToolExample<Input, Output>;
export const pollutantControlRemovalDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "environmental-engineering",
        "environmental engineering",
        "engineering",
      ],
      keywords: ["environmental engineering", "engineering"],
    },
    id: "environmental-engineering/pollutant-control-removal-delta",
    title: "Pollutant Control Removal Delta",
    description:
      "Compare compatible inlet and outlet pollutant masses, preserving negative apparent removal when outlet mass is larger.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inletMass: { type: "number", exclusiveMinimum: 0 },
        outletMass: { type: "number", minimum: 0 },
      },
      required: ["inletMass", "outletMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        removedMass: { type: "number" },
        removalFraction: { type: "number" },
      },
      required: ["removedMass", "removalFraction"],
    },
    ports: {
      inputs: [
        {
          id: "inletMass",
          label: "Inlet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outletMass",
          label: "Outlet Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "removedMass",
          label: "Removed Mass",
          valueType: { type: "number" },
        },
        {
          id: "removalFraction",
          label: "Removal Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pollutantControlRemovalDeltaTool.execute;
export default pollutantControlRemovalDeltaTool;
