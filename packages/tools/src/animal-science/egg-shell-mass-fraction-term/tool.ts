import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wholeEggMass: number;
  readonly dryShellMass: number;
  readonly membraneMass: number;
  readonly excludeMembrane: boolean;
};
export type Output = {
  readonly measuredShellMass: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wholeEggMass: { type: "number", exclusiveMinimum: 0 },
    dryShellMass: { type: "number" },
    membraneMass: { type: "number", minimum: 0 },
    excludeMembrane: { type: "boolean" },
  },
  required: ["wholeEggMass", "dryShellMass", "membraneMass", "excludeMembrane"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredShellMass: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["measuredShellMass", "fraction"],
} as const;
/** Calculate egg shell mass fraction term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wholeEggMass, dryShellMass, membraneMass, excludeMembrane } = request;
  const compute = (): Output => {
    H.positive(wholeEggMass);
    H.domain(
      membraneMass >= 0 &&
        dryShellMass >= membraneMass &&
        dryShellMass <= wholeEggMass,
    );
    return {
      measuredShellMass: dryShellMass - (excludeMembrane ? membraneMass : 0),
      fraction:
        (dryShellMass - (excludeMembrane ? membraneMass : 0)) / wholeEggMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    wholeEggMass: 60,
    dryShellMass: 7,
    membraneMass: 1,
    excludeMembrane: true,
  },
  output: { measuredShellMass: 6, fraction: 0.1 },
} satisfies ToolExample<Input, Output>;
export const eggShellMassFractionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/egg-shell-mass-fraction-term",
    title: "Egg Shell Mass Fraction Term Tool",
    description:
      "Calculate egg shell mass fraction term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wholeEggMass: { type: "number", exclusiveMinimum: 0 },
        dryShellMass: { type: "number" },
        membraneMass: { type: "number", minimum: 0 },
        excludeMembrane: { type: "boolean" },
      },
      required: [
        "wholeEggMass",
        "dryShellMass",
        "membraneMass",
        "excludeMembrane",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredShellMass: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["measuredShellMass", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "wholeEggMass",
          label: "Whole Egg Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryShellMass",
          label: "Dry Shell Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "membraneMass",
          label: "Membrane Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeMembrane",
          label: "Exclude Membrane",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "measuredShellMass",
          label: "Measured Shell Mass",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = eggShellMassFractionTermTool.execute;
export default eggShellMassFractionTermTool;
