import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const decimationFactorAliasingNoteLookupExample = {
  input: { inputRateHz: 200, decimationFactor: 4 },
  output: {
    outputRateHz: 50,
    newNyquistHz: 25,
    note: "Apply a low-pass at or below the new Nyquist before discarding samples.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const decimationFactorAliasingNoteLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ inputRateHz, decimationFactor }) => {
      if (!(inputRateHz > 0))
        simpleError("inputRateHz", "Input sample rate must be positive.");
      const out = inputRateHz / decimationFactor;
      return {
        outputRateHz: out,
        newNyquistHz: out / 2,
        note: "Apply a low-pass at or below the new Nyquist before discarding samples.",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Validate an integer decimation factor and report the output rate and anti-aliasing guidance.",
  id: "seismology/decimation-factor-aliasing-note-lookup",
  inputs: [
    {
      minimum: 0,
      description: "Input sample rate.",
      id: "inputRateHz",
      kind: "number",
      label: "f_in",
      unit: "Hz",
    },
    {
      minimum: 1,
      description: "Integer decimation factor.",
      id: "decimationFactor",
      kind: "integer",
      label: "D",
    },
  ],
  outputs: [
    {
      description: "Output sample rate.",
      id: "outputRateHz",
      kind: "number",
      label: "f_out",
      unit: "Hz",
    },
    {
      description: "Output Nyquist.",
      id: "newNyquistHz",
      kind: "number",
      label: "f_N'",
      unit: "Hz",
    },
    {
      description: "Anti-aliasing guidance.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Decimation Factor Aliasing Note Lookup",
});
export const runDecimationFactorAliasingNoteLookup =
  decimationFactorAliasingNoteLookupTool.execute;
export { decimationFactorAliasingNoteLookupExample as example };
export default decimationFactorAliasingNoteLookupTool;
