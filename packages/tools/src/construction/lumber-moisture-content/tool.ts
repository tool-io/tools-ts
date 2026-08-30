import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LumberMoistureContentInput = Readonly<{
  readonly wetMassGrams: number;
  readonly ovenDryMassGrams: number;
}>;
export type LumberMoistureContentOutput = Readonly<{
  readonly moisturePercent: number;
}>;

export const calculateLumberMoistureContent = (
  x: LumberMoistureContentInput,
): LumberMoistureContentOutput => {
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
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    moisturePercent: Object.is(moisturePercent, -0) ? 0 : moisturePercent,
  };
};

export const example = {
  input: { wetMassGrams: 110, ovenDryMassGrams: 100 },
  output: { moisturePercent: 10 },
} satisfies ToolExample<
  LumberMoistureContentInput,
  LumberMoistureContentOutput
>;

export const tool = createSimpleTool({
  id: "construction/lumber-moisture-content",
  title: "Lumber Moisture Content",
  description:
    "Dry-basis lumber moisture content from as-measured and oven-dry mass; do not confuse it with wet-basis mass fraction.",
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
    calculateLumberMoistureContent({
      wetMassGrams: input.wetMassGrams as number,
      ovenDryMassGrams: input.ovenDryMassGrams as number,
    }),
});
export const lumberMoistureContentTool = tool;
export const runLumberMoistureContent = tool.execute;
export default tool;
