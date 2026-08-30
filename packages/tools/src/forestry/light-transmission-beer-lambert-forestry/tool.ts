import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LightTransmissionBeerLambertForestryInput = Readonly<{
  readonly extinctionCoefficient: number;
  readonly leafAreaIndex: number;
}>;
export type LightTransmissionBeerLambertForestryOutput = Readonly<{
  readonly transmittedFraction: number;
}>;

export const calculateLightTransmissionBeerLambertForestry = (
  x: LightTransmissionBeerLambertForestryInput,
): LightTransmissionBeerLambertForestryOutput => {
  if (!Number.isFinite(x.extinctionCoefficient) || x.extinctionCoefficient < 0)
    simpleError(
      "extinctionCoefficient",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.leafAreaIndex) || x.leafAreaIndex < 0)
    simpleError("leafAreaIndex", "Provide a finite nonnegative number.");
  const transmittedFraction = Math.exp(
    -x.extinctionCoefficient * x.leafAreaIndex,
  );
  if (!Number.isFinite(transmittedFraction))
    simpleError(
      "transmittedFraction",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    transmittedFraction: Object.is(transmittedFraction, -0)
      ? 0
      : transmittedFraction,
  };
};

export const example = {
  input: {
    extinctionCoefficient: 0.5,
    leafAreaIndex: 3,
  },
  output: { transmittedFraction: 0.22313016014842982 },
} satisfies ToolExample<
  LightTransmissionBeerLambertForestryInput,
  LightTransmissionBeerLambertForestryOutput
>;

export const tool = createSimpleTool({
  id: "forestry/light-transmission-beer-lambert-forestry",
  title: "Light Transmission Beer Lambert Forestry",
  description:
    "Beer–Lambert canopy light transmittance exp(-k·LAI) from extinction coefficient and leaf area index.",
  inputs: [
    {
      id: "extinctionCoefficient",
      kind: "number",
      label: "Extinction Coefficient",
      minimum: 0,
    },
    {
      id: "leafAreaIndex",
      kind: "number",
      label: "Leaf Area Index",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "transmittedFraction",
      kind: "number",
      label: "Transmitted Fraction",
    },
  ],
  calculate: (input) =>
    calculateLightTransmissionBeerLambertForestry({
      extinctionCoefficient: input.extinctionCoefficient as number,
      leafAreaIndex: input.leafAreaIndex as number,
    }),
});
export const lightTransmissionBeerLambertForestryTool = tool;
export const runLightTransmissionBeerLambertForestry = tool.execute;
export default tool;
