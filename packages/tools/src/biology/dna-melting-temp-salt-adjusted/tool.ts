import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DnaMeltingTempSaltAdjustedInput = {
  readonly gcFraction: number;
  readonly lengthBp: number;
  readonly saltMolar?: number;
};

export type DnaMeltingTempSaltAdjustedOutput = {
  readonly meltingTempC: number;
};

export const dnaMeltingTempSaltAdjustedExample = {
  input: { gcFraction: 0.5, lengthBp: 20 },
  output: { meltingTempC: 55.402902071977906 },
} satisfies ToolExample<
  DnaMeltingTempSaltAdjustedInput,
  DnaMeltingTempSaltAdjustedOutput
>;

export const dnaMeltingTempSaltAdjustedTool = createSimpleTool({
  id: "biology/dna-melting-temp-salt-adjusted",
  title: "Salt-Adjusted Tm",
  description:
    "Estimate DNA melting temperature with a monovalent salt correction from GC fraction and sequence length.",
  inputs: [
    {
      id: "gcFraction",
      label: "GC fraction",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    { id: "lengthBp", label: "Sequence length", kind: "integer", unit: "bp" },
    {
      default: 0.05,
      id: "saltMolar",
      label: "Monovalent salt concentration",
      kind: "number",
      unit: "M",
    },
  ],
  outputs: [
    {
      id: "meltingTempC",
      label: "Melting temperature",
      kind: "number",
      unit: "°C",
    },
  ],
  calculate: (input) => {
    const gcFraction = input.gcFraction as number;
    const lengthBp = input.lengthBp as number;
    const saltMolar = input.saltMolar as number;
    if (!(lengthBp >= 1))
      simpleError(
        "lengthBp",
        "Length must be an integer of at least one.",
        "invalid_length",
      );
    if (!(saltMolar > 0))
      simpleError(
        "saltMolar",
        "Salt concentration must be greater than zero.",
        "invalid_salt",
      );
    return {
      meltingTempC:
        81.5 + 16.6 * Math.log10(saltMolar) + 41 * gcFraction - 500 / lengthBp,
    };
  },
});
export const runDnaMeltingTempSaltAdjusted =
  dnaMeltingTempSaltAdjustedTool.execute;
export default dnaMeltingTempSaltAdjustedTool;
