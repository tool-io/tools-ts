import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly removedMass: number;
  readonly producedMass: number;
  readonly returnedMass: number;
  readonly creditReturned: boolean;
};
export type Output = { readonly netRemoved: number; readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    removedMass: { type: "number", minimum: 0 },
    producedMass: { type: "number", exclusiveMinimum: 0 },
    returnedMass: { type: "number", minimum: 0 },
    creditReturned: { type: "boolean" },
  },
  required: ["removedMass", "producedMass", "returnedMass", "creditReturned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netRemoved: { type: "number" }, fraction: { type: "number" } },
  required: ["netRemoved", "fraction"],
} as const;
/** Calculate residue removal mass fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { removedMass, producedMass, returnedMass, creditReturned } = request;
  const compute = (): Output => {
    H.positive(producedMass);
    H.domain(
      removedMass >= 0 &&
        removedMass <= producedMass &&
        returnedMass >= 0 &&
        returnedMass <= removedMass,
    );
    return {
      netRemoved: removedMass - (creditReturned ? returnedMass : 0),
      fraction:
        (removedMass - (creditReturned ? returnedMass : 0)) / producedMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    removedMass: 30,
    producedMass: 100,
    returnedMass: 10,
    creditReturned: true,
  },
  output: { netRemoved: 20, fraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const residueRemovalMassFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/residue-removal-mass-fraction",
    title: "Residue Removal Mass Fraction Tool",
    description:
      "Calculate residue removal mass fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        removedMass: { type: "number", minimum: 0 },
        producedMass: { type: "number", exclusiveMinimum: 0 },
        returnedMass: { type: "number", minimum: 0 },
        creditReturned: { type: "boolean" },
      },
      required: [
        "removedMass",
        "producedMass",
        "returnedMass",
        "creditReturned",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netRemoved: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["netRemoved", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "removedMass",
          label: "Removed Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "producedMass",
          label: "Produced Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnedMass",
          label: "Returned Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditReturned",
          label: "Credit Returned",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "netRemoved",
          label: "Net Removed",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = residueRemovalMassFractionTool.execute;
export default residueRemovalMassFractionTool;
