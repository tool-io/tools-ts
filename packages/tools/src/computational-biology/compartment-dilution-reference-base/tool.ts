import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialAmount: number;
  readonly initialVolume: number;
  readonly addedVolume: number;
  readonly referenceVolume: number;
};
export type Output = {
  readonly newConcentration: number;
  readonly amountOnReferenceVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialAmount: { type: "number", minimum: 0 },
    initialVolume: { type: "number", exclusiveMinimum: 0 },
    addedVolume: { type: "number", minimum: 0 },
    referenceVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "initialAmount",
    "initialVolume",
    "addedVolume",
    "referenceVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newConcentration: { type: "number" },
    amountOnReferenceVolume: { type: "number" },
  },
  required: ["newConcentration", "amountOnReferenceVolume"],
} as const;
/** Calculate compartment dilution reference base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialAmount, initialVolume, addedVolume, referenceVolume } =
    request;
  const compute = (): Output => {
    H.domain(initialAmount >= 0 && addedVolume >= 0);
    H.positive(initialVolume);
    H.positive(referenceVolume);
    return {
      newConcentration: initialAmount / (initialVolume + addedVolume),
      amountOnReferenceVolume:
        (initialAmount * referenceVolume) / (initialVolume + addedVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialAmount: 10,
    initialVolume: 2,
    addedVolume: 3,
    referenceVolume: 1,
  },
  output: { newConcentration: 2, amountOnReferenceVolume: 2 },
} satisfies ToolExample<Input, Output>;
export const compartmentDilutionReferenceBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/compartment-dilution-reference-base",
    title: "Compartment Dilution Reference Base Tool",
    description:
      "Calculate compartment dilution reference base from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialAmount: { type: "number", minimum: 0 },
        initialVolume: { type: "number", exclusiveMinimum: 0 },
        addedVolume: { type: "number", minimum: 0 },
        referenceVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "initialAmount",
        "initialVolume",
        "addedVolume",
        "referenceVolume",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newConcentration: { type: "number" },
        amountOnReferenceVolume: { type: "number" },
      },
      required: ["newConcentration", "amountOnReferenceVolume"],
    },
    ports: {
      inputs: [
        {
          id: "initialAmount",
          label: "Initial Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialVolume",
          label: "Initial Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedVolume",
          label: "Added Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceVolume",
          label: "Reference Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "newConcentration",
          label: "New Concentration",
          valueType: { type: "number" },
        },
        {
          id: "amountOnReferenceVolume",
          label: "Amount On Reference Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = compartmentDilutionReferenceBaseTool.execute;
export default compartmentDilutionReferenceBaseTool;
