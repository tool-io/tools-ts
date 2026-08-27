import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpecificRootLengthInput = {
  readonly rootDryMassG: number;
  readonly rootLengthMeters: number;
};

export type SpecificRootLengthOutput = {
  readonly specificRootLength: number;
};

export const specificRootLengthExample = {
  input: { rootDryMassG: 0.5, rootLengthMeters: 25 },
  output: { specificRootLength: 50 },
} satisfies ToolExample<SpecificRootLengthInput, SpecificRootLengthOutput>;

export const specificRootLengthTool = createSimpleTool({
  id: "biology/specific-root-length",
  title: "Specific Root Length",
  description:
    "Compute specific root length SRL in metres per gram as root length divided by root dry mass.",
  inputs: [
    {
      id: "rootLengthMeters",
      kind: "number",
      label: "Root length",
      unit: "m",
    },
    {
      id: "rootDryMassG",
      kind: "number",
      label: "Root dry mass",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "specificRootLength",
      kind: "number",
      label: "Specific root length",
      unit: "m/g",
    },
  ],
  calculate: (input) => {
    const rootLengthMeters = input.rootLengthMeters as number;
    const rootDryMassG = input.rootDryMassG as number;
    if (!(rootLengthMeters > 0))
      simpleError(
        "rootLengthMeters",
        "The root length must be greater than zero.",
      );
    if (!(rootDryMassG > 0))
      simpleError(
        "rootDryMassG",
        "The root dry mass must be greater than zero.",
      );
    return { specificRootLength: rootLengthMeters / rootDryMassG };
  },
});
export const runSpecificRootLength = specificRootLengthTool.execute;
export default specificRootLengthTool;
