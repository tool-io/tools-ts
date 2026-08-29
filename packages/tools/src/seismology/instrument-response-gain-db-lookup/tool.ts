import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const instrumentResponseGainDbLookupExample = {
  input: { gainFactor: 1000 },
  output: { gainDb: 60, isAttenuation: false },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const instrumentResponseGainDbLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ gainFactor }) => {
      if (gainFactor <= 0) simpleError("gainFactor", "Gain must be positive.");
      return {
        gainDb: 20 * Math.log10(gainFactor),
        isAttenuation: gainFactor < 1,
      };
    })(input as never) as Record<string, unknown>,
  description: "Convert a dimensionless gain factor to decibels (20·log₁₀).",
  id: "seismology/instrument-response-gain-db-lookup",
  inputs: [
    {
      minimum: 0,
      description: "Output/input ratio.",
      id: "gainFactor",
      kind: "number",
      label: "G",
    },
  ],
  outputs: [
    {
      description: "Gain in decibels.",
      id: "gainDb",
      kind: "number",
      label: "dB",
      unit: "dB",
    },
    {
      description: "Whether the stage attenuates.",
      id: "isAttenuation",
      kind: "boolean",
      label: "Atten",
    },
  ],
  title: "Instrument Response Gain DB Lookup",
});
export const runInstrumentResponseGainDbLookup =
  instrumentResponseGainDbLookupTool.execute;
export { instrumentResponseGainDbLookupExample as example };
export default instrumentResponseGainDbLookupTool;
