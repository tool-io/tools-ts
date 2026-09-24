import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCell: number;
  readonly secondCell: number;
  readonly contactCoefficient: number;
  readonly contactMeasure: number;
};
export type Output = { readonly sameCell: boolean; readonly energy: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCell: { type: "integer", minimum: 0 },
    secondCell: { type: "integer", minimum: 0 },
    contactCoefficient: { type: "number" },
    contactMeasure: { type: "number", minimum: 0 },
  },
  required: ["firstCell", "secondCell", "contactCoefficient", "contactMeasure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sameCell: { type: "boolean" }, energy: { type: "number" } },
  required: ["sameCell", "energy"],
} as const;
/** One Cellular Potts interfacial J*(1-delta(cellId1,cellId2)) contribution; coefficient is supplied, including its sign. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCell, secondCell, contactCoefficient, contactMeasure } = request;
  const compute = (): Output => {
    H.integer(firstCell, 0);
    H.integer(secondCell, 0);
    H.domain(contactMeasure >= 0);
    return {
      sameCell: firstCell === secondCell,
      energy:
        firstCell === secondCell ? 0 : contactCoefficient * contactMeasure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstCell: 1,
    secondCell: 2,
    contactCoefficient: 3,
    contactMeasure: 4,
  },
  output: { sameCell: false, energy: 12 },
} satisfies ToolExample<Input, Output>;
export const cellularPottsOneContactEnergyTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/cellular-potts-one-contact-energy-term",
    title: "Cellular Potts One Contact Energy Term Tool",
    description:
      "One Cellular Potts interfacial J*(1-delta(cellId1,cellId2)) contribution; coefficient is supplied, including its sign.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCell: { type: "integer", minimum: 0 },
        secondCell: { type: "integer", minimum: 0 },
        contactCoefficient: { type: "number" },
        contactMeasure: { type: "number", minimum: 0 },
      },
      required: [
        "firstCell",
        "secondCell",
        "contactCoefficient",
        "contactMeasure",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sameCell: { type: "boolean" }, energy: { type: "number" } },
      required: ["sameCell", "energy"],
    },
    ports: {
      inputs: [
        {
          id: "firstCell",
          label: "First Cell",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondCell",
          label: "Second Cell",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "contactCoefficient",
          label: "Contact Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contactMeasure",
          label: "Contact Measure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "sameCell", label: "Same Cell", valueType: { type: "boolean" } },
        { id: "energy", label: "Energy", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cellularPottsOneContactEnergyTermTool.execute;
export default cellularPottsOneContactEnergyTermTool;
