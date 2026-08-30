import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TouchScreenResistanceInput = Readonly<{
  readonly sheetResistanceOhmPerSquare: number;
  readonly currentPathLengthMm: number;
  readonly electrodeWidthMm: number;
}>;
export type TouchScreenResistanceOutput = Readonly<{
  readonly layerResistanceOhm: number;
}>;

export const calculateTouchScreenResistance = (
  x: TouchScreenResistanceInput,
): TouchScreenResistanceOutput => {
  if (
    !Number.isFinite(x.sheetResistanceOhmPerSquare) ||
    x.sheetResistanceOhmPerSquare < 0
  )
    simpleError(
      "sheetResistanceOhmPerSquare",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.currentPathLengthMm) || x.currentPathLengthMm < 0)
    simpleError("currentPathLengthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.electrodeWidthMm) || x.electrodeWidthMm < 0)
    simpleError("electrodeWidthMm", "Provide a finite number at least 0.");
  if (!(x.electrodeWidthMm > 0))
    simpleError("electrodeWidthMm", "Electrode width must be positive.");
  const layerResistanceOhm =
    (x.sheetResistanceOhmPerSquare * x.currentPathLengthMm) /
    x.electrodeWidthMm;
  if (!Number.isFinite(layerResistanceOhm))
    simpleError("layerResistanceOhm", "The inputs produce an invalid result.");
  return {
    layerResistanceOhm: Object.is(layerResistanceOhm, -0)
      ? 0
      : layerResistanceOhm,
  };
};

export const example = {
  input: {
    sheetResistanceOhmPerSquare: 100,
    currentPathLengthMm: 100,
    electrodeWidthMm: 50,
  },
  output: { layerResistanceOhm: 200 },
} satisfies ToolExample<
  TouchScreenResistanceInput,
  TouchScreenResistanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/touch-screen-resistance",
  title: "Touch Screen Resistance",
  description:
    "Estimate end-to-end resistance of a uniform rectangular resistive touch layer with electrodes across its full width.",
  inputs: [
    {
      id: "sheetResistanceOhmPerSquare",
      kind: "number",
      label: "Sheet resistance",
      unit: "Ω/□",
      minimum: 0,
    },
    {
      id: "currentPathLengthMm",
      kind: "number",
      label: "Current-path length",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "electrodeWidthMm",
      kind: "number",
      label: "Electrode width",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "layerResistanceOhm",
      kind: "number",
      label: "Layer resistance",
      unit: "Ω",
    },
  ],
  calculate: (input) =>
    calculateTouchScreenResistance({
      sheetResistanceOhmPerSquare: input.sheetResistanceOhmPerSquare as number,
      currentPathLengthMm: input.currentPathLengthMm as number,
      electrodeWidthMm: input.electrodeWidthMm as number,
    }),
});
export const touchScreenResistanceTool = tool;
export const runTouchScreenResistance = tool.execute;
export default tool;
