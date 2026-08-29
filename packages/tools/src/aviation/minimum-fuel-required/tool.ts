import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    tripFuel: 100,
    alternateFuel: 20,
    contingencyFuel: 10,
    reserveFuel: 30,
    fuelOnBoard: 180,
  },
  output: { requiredFuel: 160, marginFuel: 20 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "aviation/minimum-fuel-required",
  title: "Minimum Fuel Required",
  description:
    "Add planned trip, alternate, contingency, and final-reserve fuel in one consistent unit, then show the margin against fuel on board. It does not substitute for route-specific regulations or aircraft performance planning.",
  inputs: [
    { id: "tripFuel", kind: "number", label: "Trip fuel", minimum: 0 },
    {
      id: "alternateFuel",
      kind: "number",
      label: "Alternate fuel",
      minimum: 0,
    },
    {
      id: "contingencyFuel",
      kind: "number",
      label: "Contingency fuel",
      minimum: 0,
    },
    {
      id: "reserveFuel",
      kind: "number",
      label: "Final reserve fuel",
      minimum: 0,
    },
    { id: "fuelOnBoard", kind: "number", label: "Fuel on board", minimum: 0 },
  ],
  outputs: [
    { id: "requiredFuel", kind: "number", label: "Required Fuel" },
    { id: "marginFuel", kind: "number", label: "Margin Fuel" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      requiredFuel:
        i.tripFuel + i.alternateFuel + i.contingencyFuel + i.reserveFuel,
      marginFuel:
        i.fuelOnBoard -
        (i.tripFuel + i.alternateFuel + i.contingencyFuel + i.reserveFuel),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type MinimumFuelRequiredInput = Readonly<typeof example.input>;
export type MinimumFuelRequiredOutput = Readonly<typeof example.output>;
export const minimumFuelRequiredTool = tool;
export const runMinimumFuelRequired = tool.execute;
export default tool;
