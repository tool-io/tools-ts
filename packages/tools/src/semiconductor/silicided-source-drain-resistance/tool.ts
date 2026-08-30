import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SilicidedSourceDrainResistanceInput = Readonly<{
  readonly sheetOhmsPerSquare: number;
  readonly lengthMicrometers: number;
  readonly widthMicrometers: number;
  readonly contactOhms: number;
}>;
export type SilicidedSourceDrainResistanceOutput = Readonly<{
  readonly totalOhms: number;
}>;

export const calculateSilicidedSourceDrainResistance = (
  x: SilicidedSourceDrainResistanceInput,
): SilicidedSourceDrainResistanceOutput => {
  if (!Number.isFinite(x.sheetOhmsPerSquare) || x.sheetOhmsPerSquare < 0)
    simpleError("sheetOhmsPerSquare", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lengthMicrometers) || x.lengthMicrometers < 0)
    simpleError("lengthMicrometers", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.widthMicrometers) || x.widthMicrometers < 0)
    simpleError("widthMicrometers", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.contactOhms) || x.contactOhms < 0)
    simpleError("contactOhms", "Provide a finite number at least 0.");
  const totalOhms =
    (x.sheetOhmsPerSquare * x.lengthMicrometers) / x.widthMicrometers +
    2 * x.contactOhms;
  if (!Number.isFinite(totalOhms))
    simpleError(
      "totalOhms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { totalOhms: Object.is(totalOhms, -0) ? 0 : totalOhms };
};

export const example = {
  input: {
    sheetOhmsPerSquare: 2,
    lengthMicrometers: 10,
    widthMicrometers: 5,
    contactOhms: 0.1,
  },
  output: { totalOhms: 4.2 },
} satisfies ToolExample<
  SilicidedSourceDrainResistanceInput,
  SilicidedSourceDrainResistanceOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/silicided-source-drain-resistance",
  title: "Silicided Source Drain Resistance",
  description:
    "Series source/drain resistance from silicide sheet resistance, rectangular squares and two contact resistances.",
  inputs: [
    {
      id: "sheetOhmsPerSquare",
      kind: "number",
      label: "Sheet Ohms Per Square",
      unit: "Ω/□",
      minimum: 0,
    },
    {
      id: "lengthMicrometers",
      kind: "number",
      label: "Length Micrometers",
      unit: "µm",
      minimum: 0,
    },
    {
      id: "widthMicrometers",
      kind: "number",
      label: "Width Micrometers",
      unit: "µm",
      minimum: 0,
    },
    {
      id: "contactOhms",
      kind: "number",
      label: "Contact Ohms",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "totalOhms", kind: "number", label: "Total Ohms", unit: "Ω" },
  ],
  calculate: (input) =>
    calculateSilicidedSourceDrainResistance({
      sheetOhmsPerSquare: input.sheetOhmsPerSquare as number,
      lengthMicrometers: input.lengthMicrometers as number,
      widthMicrometers: input.widthMicrometers as number,
      contactOhms: input.contactOhms as number,
    }),
});
export const silicidedSourceDrainResistanceTool = tool;
export const runSilicidedSourceDrainResistance = tool.execute;
export default tool;
