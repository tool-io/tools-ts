import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransferLengthInput = {
  readonly sheetResistanceOhmsPerSquare: number;
  readonly specificContactResistivityOhmCm2: number;
};

export type TransferLengthOutput = {
  readonly transferLengthUm: number;
};

export const transferLengthExample = {
  input: {
    sheetResistanceOhmsPerSquare: 100,
    specificContactResistivityOhmCm2: 1e-6,
  },
  output: { transferLengthUm: 1 },
} satisfies ToolExample<TransferLengthInput, TransferLengthOutput>;

export const calculateTransferLength = (
  input: TransferLengthInput,
): TransferLengthOutput => {
  const sheetResistanceOhmsPerSquare = input.sheetResistanceOhmsPerSquare;
  const specificContactResistivityOhmCm2 =
    input.specificContactResistivityOhmCm2;

  if (
    !Number.isFinite(sheetResistanceOhmsPerSquare) ||
    sheetResistanceOhmsPerSquare <= 0
  )
    simpleError(
      "sheetResistanceOhmsPerSquare",
      "Sheet resistance must be a finite positive number.",
      "invalid_sheet_resistance",
    );
  if (
    !Number.isFinite(specificContactResistivityOhmCm2) ||
    specificContactResistivityOhmCm2 <= 0
  )
    simpleError(
      "specificContactResistivityOhmCm2",
      "Specific contact resistivity must be a finite positive number.",
      "invalid_contact_resistivity",
    );

  const logTransferLengthUm =
    0.5 *
      (Math.log(specificContactResistivityOhmCm2) -
        Math.log(sheetResistanceOhmsPerSquare)) +
    Math.log(1e4);
  const directTransferLengthUm =
    Math.sqrt(specificContactResistivityOhmCm2 / sheetResistanceOhmsPerSquare) *
    1e4;
  const transferLengthUm =
    Number.isFinite(directTransferLengthUm) && directTransferLengthUm > 0
      ? directTransferLengthUm
      : Math.exp(logTransferLengthUm);
  if (!Number.isFinite(transferLengthUm) || transferLengthUm === 0)
    simpleError(
      "specificContactResistivityOhmCm2",
      "Transfer length is outside the representable positive range.",
      transferLengthUm === 0 ? "numeric_underflow" : "numeric_overflow",
    );

  return { transferLengthUm: transferLengthUm === 0 ? 0 : transferLengthUm };
};

export const transferLengthTool = createSimpleTool({
  calculate: (input) =>
    calculateTransferLength({
      sheetResistanceOhmsPerSquare:
        input.sheetResistanceOhmsPerSquare as number,
      specificContactResistivityOhmCm2:
        input.specificContactResistivityOhmCm2 as number,
    }),
  description:
    "Convert specific contact resistivity and sheet resistance into the contact transfer length. Formula: Lt [µm] = 1e4 · sqrt(ρc [Ω·cm²] / Rsh [Ω/sq]). Inputs: ρc > 0 Ω·cm², Rsh > 0 Ω/sq. Output: Lt > 0 µm. Assumes uniform sheet resistance under the contact and the transmission-line model (long contact, negligible metal resistance).",
  id: "semiconductor/contact-resistance-transfer-length",
  inputs: [
    {
      description:
        "Specific contact resistivity of the ohmic contact. Must be greater than 0 Ω·cm².",
      format: "resistivity-area",
      id: "specificContactResistivityOhmCm2",
      kind: "number",
      label: "Specific contact resistivity",
      minimum: Number.MIN_VALUE,
      unit: "ohm*cm^2",
    },
    {
      description:
        "Sheet resistance of the semiconductor layer under the contact. Must be greater than 0 Ω/sq.",
      format: "sheet-resistance",
      id: "sheetResistanceOhmsPerSquare",
      kind: "number",
      label: "Sheet resistance",
      minimum: Number.MIN_VALUE,
      unit: "ohm/sq",
    },
  ],
  outputs: [
    {
      description: "Current transfer length of the contact. At least 0 µm.",
      format: "length",
      id: "transferLengthUm",
      kind: "number",
      label: "Transfer length",
      minimum: Number.MIN_VALUE,
      unit: "um",
    },
  ],
  title: "Transfer Length Calculator",
});
export const runTransferLength = transferLengthTool.execute;
export default transferLengthTool;
