import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ElectricalLightingWattsPerSqftInput = Readonly<{
  readonly fixtureWatts: number;
  readonly floorSquareFeet: number;
}>;
export type ElectricalLightingWattsPerSqftOutput = Readonly<{
  readonly wattsPerSquareFoot: number;
}>;

export const calculateElectricalLightingWattsPerSqft = (
  x: ElectricalLightingWattsPerSqftInput,
): ElectricalLightingWattsPerSqftOutput => {
  if (!Number.isFinite(x.fixtureWatts) || x.fixtureWatts < 0)
    simpleError("fixtureWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.floorSquareFeet) || x.floorSquareFeet < 0)
    simpleError("floorSquareFeet", "Provide a finite number at least 0.");
  const wattsPerSquareFoot = x.fixtureWatts / x.floorSquareFeet;
  if (!Number.isFinite(wattsPerSquareFoot))
    simpleError(
      "wattsPerSquareFoot",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    wattsPerSquareFoot: Object.is(wattsPerSquareFoot, -0)
      ? 0
      : wattsPerSquareFoot,
  };
};

export const example = {
  input: { fixtureWatts: 1000, floorSquareFeet: 500 },
  output: { wattsPerSquareFoot: 2 },
} satisfies ToolExample<
  ElectricalLightingWattsPerSqftInput,
  ElectricalLightingWattsPerSqftOutput
>;

export const tool = createSimpleTool({
  id: "construction/electrical-lighting-watts-per-sqft",
  title: "Electrical Lighting Watts Per Sqft",
  description:
    "Installed lighting power density from total fixture wattage and lit floor area, without code-compliance assessment.",
  inputs: [
    {
      id: "fixtureWatts",
      kind: "number",
      label: "Fixture Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "floorSquareFeet",
      kind: "number",
      label: "Floor Square Feet",
      unit: "ft²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "wattsPerSquareFoot",
      kind: "number",
      label: "Watts Per Square Foot",
      unit: "W/ft²",
    },
  ],
  calculate: (input) =>
    calculateElectricalLightingWattsPerSqft({
      fixtureWatts: input.fixtureWatts as number,
      floorSquareFeet: input.floorSquareFeet as number,
    }),
});
export const electricalLightingWattsPerSqftTool = tool;
export const runElectricalLightingWattsPerSqft = tool.execute;
export default tool;
