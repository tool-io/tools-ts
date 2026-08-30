import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HolzschraubeVorbohrung07dInput = Readonly<{
  readonly screwDiameterMillimeters: number;
}>;
export type HolzschraubeVorbohrung07dOutput = Readonly<{
  readonly pilotDiameterMillimeters: number;
}>;

export const calculateHolzschraubeVorbohrung07d = (
  x: HolzschraubeVorbohrung07dInput,
): HolzschraubeVorbohrung07dOutput => {
  if (
    !Number.isFinite(x.screwDiameterMillimeters) ||
    x.screwDiameterMillimeters < 0
  )
    simpleError(
      "screwDiameterMillimeters",
      "Provide a finite number at least 0.",
    );
  const pilotDiameterMillimeters = 0.7 * x.screwDiameterMillimeters;
  if (!Number.isFinite(pilotDiameterMillimeters))
    simpleError(
      "pilotDiameterMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pilotDiameterMillimeters: Object.is(pilotDiameterMillimeters, -0)
      ? 0
      : pilotDiameterMillimeters,
  };
};

export const example = {
  input: { screwDiameterMillimeters: 5 },
  output: { pilotDiameterMillimeters: 3.5 },
} satisfies ToolExample<
  HolzschraubeVorbohrung07dInput,
  HolzschraubeVorbohrung07dOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/holzschraube-vorbohrung-07d",
  title: "Holzschraube Vorbohrung 07d",
  description:
    "Rule-of-thumb pilot diameter equal to 70% of a wood screw's outside diameter; adjust for screw and timber manufacturer guidance.",
  inputs: [
    {
      id: "screwDiameterMillimeters",
      kind: "number",
      label: "Screw Diameter Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pilotDiameterMillimeters",
      kind: "number",
      label: "Pilot Diameter Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateHolzschraubeVorbohrung07d({
      screwDiameterMillimeters: input.screwDiameterMillimeters as number,
    }),
});
export const holzschraubeVorbohrung07dTool = tool;
export const runHolzschraubeVorbohrung07d = tool.execute;
export default tool;
