import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RadiativeHeatTransferInput = Readonly<{
  readonly emissivity: number;
  readonly areaSquareMeters: number;
  readonly surfaceKelvin: number;
  readonly surroundingsKelvin: number;
}>;
export type RadiativeHeatTransferOutput = Readonly<{
  readonly netWatts: number;
}>;

export const calculateRadiativeHeatTransfer = (
  x: RadiativeHeatTransferInput,
): RadiativeHeatTransferOutput => {
  if (!Number.isFinite(x.emissivity) || x.emissivity < 0)
    simpleError("emissivity", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.areaSquareMeters) || x.areaSquareMeters < 0)
    simpleError("areaSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.surfaceKelvin) || x.surfaceKelvin < 0)
    simpleError("surfaceKelvin", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.surroundingsKelvin) || x.surroundingsKelvin < 0)
    simpleError("surroundingsKelvin", "Provide a finite number at least 0.");
  if (x.emissivity > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const netWatts =
    x.emissivity *
    5.670374419e-8 *
    x.areaSquareMeters *
    (x.surfaceKelvin ** 4 - x.surroundingsKelvin ** 4);
  if (!Number.isFinite(netWatts))
    simpleError(
      "netWatts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { netWatts: Object.is(netWatts, -0) ? 0 : netWatts };
};

export const example = {
  input: {
    emissivity: 0.8,
    areaSquareMeters: 1,
    surfaceKelvin: 400,
    surroundingsKelvin: 300,
  },
  output: { netWatts: 793.85241866 },
} satisfies ToolExample<
  RadiativeHeatTransferInput,
  RadiativeHeatTransferOutput
>;

export const tool = createSimpleTool({
  id: "engineering/radiative-heat-transfer",
  title: "Radiative Heat Transfer",
  description:
    "Net ideal gray-surface radiation exchange against a large isothermal environment using absolute kelvin temperatures.",
  inputs: [
    { id: "emissivity", kind: "number", label: "Emissivity", minimum: 0 },
    {
      id: "areaSquareMeters",
      kind: "number",
      label: "Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "surfaceKelvin",
      kind: "number",
      label: "Surface Kelvin",
      unit: "K",
      minimum: 0,
    },
    {
      id: "surroundingsKelvin",
      kind: "number",
      label: "Surroundings Kelvin",
      unit: "K",
      minimum: 0,
    },
  ],
  outputs: [{ id: "netWatts", kind: "number", label: "Net Watts", unit: "W" }],
  calculate: (input) =>
    calculateRadiativeHeatTransfer({
      emissivity: input.emissivity as number,
      areaSquareMeters: input.areaSquareMeters as number,
      surfaceKelvin: input.surfaceKelvin as number,
      surroundingsKelvin: input.surroundingsKelvin as number,
    }),
});
export const radiativeHeatTransferTool = tool;
export const runRadiativeHeatTransfer = tool.execute;
export default tool;
