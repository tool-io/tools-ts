import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HolzGewichtBeiFeuchteInput = Readonly<{
  readonly ovenDryMassKilograms: number;
  readonly moisturePercent: number;
}>;
export type HolzGewichtBeiFeuchteOutput = Readonly<{
  readonly wetMassKilograms: number;
}>;

export const calculateHolzGewichtBeiFeuchte = (
  x: HolzGewichtBeiFeuchteInput,
): HolzGewichtBeiFeuchteOutput => {
  if (!Number.isFinite(x.ovenDryMassKilograms) || x.ovenDryMassKilograms < 0)
    simpleError("ovenDryMassKilograms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.moisturePercent) || x.moisturePercent < 0)
    simpleError("moisturePercent", "Provide a finite number at least 0.");
  const wetMassKilograms =
    x.ovenDryMassKilograms * (1 + x.moisturePercent / 100);
  if (!Number.isFinite(wetMassKilograms))
    simpleError(
      "wetMassKilograms",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    wetMassKilograms: Object.is(wetMassKilograms, -0) ? 0 : wetMassKilograms,
  };
};

export const example = {
  input: { ovenDryMassKilograms: 100, moisturePercent: 10 },
  output: { wetMassKilograms: 110.00000000000001 },
} satisfies ToolExample<
  HolzGewichtBeiFeuchteInput,
  HolzGewichtBeiFeuchteOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/holz-gewicht-bei-feuchte",
  title: "Holz Gewicht Bei Feuchte",
  description:
    "Wood mass at a target dry-basis moisture content from its oven-dry mass.",
  inputs: [
    {
      id: "ovenDryMassKilograms",
      kind: "number",
      label: "Oven Dry Mass Kilograms",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "moisturePercent",
      kind: "number",
      label: "Moisture Percent",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "wetMassKilograms",
      kind: "number",
      label: "Wet Mass Kilograms",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateHolzGewichtBeiFeuchte({
      ovenDryMassKilograms: input.ovenDryMassKilograms as number,
      moisturePercent: input.moisturePercent as number,
    }),
});
export const holzGewichtBeiFeuchteTool = tool;
export const runHolzGewichtBeiFeuchte = tool.execute;
export default tool;
