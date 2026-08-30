import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HolzfeuchteBerechnungInput = Readonly<{
  readonly wetMassGrams: number;
  readonly ovenDryMassGrams: number;
}>;
export type HolzfeuchteBerechnungOutput = Readonly<{
  readonly moisturePercent: number;
}>;

export const calculateHolzfeuchteBerechnung = (
  x: HolzfeuchteBerechnungInput,
): HolzfeuchteBerechnungOutput => {
  if (!Number.isFinite(x.wetMassGrams) || x.wetMassGrams < 0)
    simpleError("wetMassGrams", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.ovenDryMassGrams) || x.ovenDryMassGrams < 0)
    simpleError("ovenDryMassGrams", "Provide a finite number at least 0.");
  if (x.wetMassGrams < x.ovenDryMassGrams)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const moisturePercent =
    (100 * (x.wetMassGrams - x.ovenDryMassGrams)) / x.ovenDryMassGrams;
  if (!Number.isFinite(moisturePercent))
    simpleError(
      "moisturePercent",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    moisturePercent: Object.is(moisturePercent, -0) ? 0 : moisturePercent,
  };
};

export const example = {
  input: { wetMassGrams: 110, ovenDryMassGrams: 100 },
  output: { moisturePercent: 10 },
} satisfies ToolExample<
  HolzfeuchteBerechnungInput,
  HolzfeuchteBerechnungOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/holzfeuchte-berechnung",
  title: "Holzfeuchte Berechnung",
  description:
    "Holzfeuchte (dry-basis moisture content) from current and oven-dry wood masses; not a wet-basis percentage.",
  inputs: [
    {
      id: "wetMassGrams",
      kind: "number",
      label: "Wet Mass Grams",
      unit: "g",
      minimum: 0,
    },
    {
      id: "ovenDryMassGrams",
      kind: "number",
      label: "Oven Dry Mass Grams",
      unit: "g",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "moisturePercent",
      kind: "number",
      label: "Moisture Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateHolzfeuchteBerechnung({
      wetMassGrams: input.wetMassGrams as number,
      ovenDryMassGrams: input.ovenDryMassGrams as number,
    }),
});
export const holzfeuchteBerechnungTool = tool;
export const runHolzfeuchteBerechnung = tool.execute;
export default tool;
