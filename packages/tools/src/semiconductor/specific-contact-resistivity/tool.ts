import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpecificContactResistivityInput = {
  readonly contactResistanceOhms: number;
  readonly contactWidthUm: number;
  readonly transferLengthUm: number;
};

export type SpecificContactResistivityOutput = {
  readonly specificContactResistivityOhmCm2: number;
};

export const specificContactResistivityExample = {
  input: {
    contactResistanceOhms: 100,
    contactWidthUm: 100,
    transferLengthUm: 1,
  },
  output: { specificContactResistivityOhmCm2: 0.0001 },
} satisfies ToolExample<
  SpecificContactResistivityInput,
  SpecificContactResistivityOutput
>;

export const calculateSpecificContactResistivity = (
  input: SpecificContactResistivityInput,
): SpecificContactResistivityOutput => {
  if (input.contactResistanceOhms <= 0)
    simpleError(
      "contactResistanceOhms",
      "Contact resistance must be positive.",
      "invalid_contact_resistance",
    );
  if (input.transferLengthUm <= 0)
    simpleError(
      "transferLengthUm",
      "Transfer length must be positive.",
      "invalid_transfer_length",
    );
  if (input.contactWidthUm <= 0)
    simpleError(
      "contactWidthUm",
      "Contact width must be positive.",
      "invalid_contact_width",
    );
  return {
    specificContactResistivityOhmCm2:
      input.contactResistanceOhms *
      input.contactWidthUm *
      input.transferLengthUm *
      1e-8,
  };
};

export const specificContactResistivityTool = createSimpleTool({
  calculate: (input) =>
    calculateSpecificContactResistivity({
      contactResistanceOhms: input.contactResistanceOhms as number,
      contactWidthUm: input.contactWidthUm as number,
      transferLengthUm: input.transferLengthUm as number,
    }),
  description:
    "Calculate specific contact resistivity from measured contact resistance, contact width, and transfer length using the transmission-line relation rho-c = Rc W LT.",
  id: "semiconductor/specific-contact-resistivity",
  inputs: [
    {
      description: "Measured ohmic contact resistance.",
      format: "resistance",
      id: "contactResistanceOhms",
      kind: "number",
      label: "Contact resistance",
      unit: "ohm",
    },
    {
      description:
        "Width of the measured contact perpendicular to current flow.",
      format: "length",
      id: "contactWidthUm",
      kind: "number",
      label: "Contact width",
      unit: "um",
    },
    {
      description: "Current transfer length of the contact.",
      format: "length",
      id: "transferLengthUm",
      kind: "number",
      label: "Transfer length",
      unit: "um",
    },
  ],
  outputs: [
    {
      description: "Specific contact resistivity of the ohmic contact.",
      format: "resistivity-area",
      id: "specificContactResistivityOhmCm2",
      kind: "number",
      label: "Specific contact resistivity",
      unit: "ohm*cm^2",
    },
  ],
  title: "Specific Contact Resistivity Calculator",
});
export const runSpecificContactResistivity =
  specificContactResistivityTool.execute;
export default specificContactResistivityTool;
