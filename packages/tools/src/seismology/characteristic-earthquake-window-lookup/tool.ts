import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const characteristicEarthquakeMagnitudeWindowLookupExample = {
  input: { faultLengthKm: 50 },
  output: { magnitudeMw: 6.911465306460668 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const characteristicEarthquakeMagnitudeWindowLookupTool =
  createSimpleTool({
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ faultLengthKm }) => {
        if (!(faultLengthKm > 0))
          simpleError("faultLengthKm", "Fault length must be positive.");
        return { magnitudeMw: 4.38 + 1.49 * Math.log10(faultLengthKm) };
      })(input as never) as Record<string, unknown>,
    description:
      "Estimate characteristic magnitude from a fault length using the Wells & Coppersmith strike-slip relation.",
    id: "seismology/characteristic-earthquake-window-lookup",
    inputs: [
      {
        minimum: 0,
        description: "Fault length.",
        id: "faultLengthKm",
        kind: "number",
        label: "L",
        unit: "km",
      },
    ],
    outputs: [
      {
        description: "Characteristic magnitude.",
        id: "magnitudeMw",
        kind: "number",
        label: "M_w",
      },
    ],
    title: "Characteristic Earthquake Magnitude Window Lookup",
  });
export const runCharacteristicEarthquakeMagnitudeWindowLookup =
  characteristicEarthquakeMagnitudeWindowLookupTool.execute;
export { characteristicEarthquakeMagnitudeWindowLookupExample as example };
export default characteristicEarthquakeMagnitudeWindowLookupTool;
