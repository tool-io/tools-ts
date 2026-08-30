import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly stockHauPerReferenceVolume: number;
  readonly referenceVolumeUl: number;
  readonly targetHau: number;
  readonly targetReactionVolumeUl: number;
}>;
export type Output = Readonly<{
  readonly stockVolumeUl: number;
  readonly diluentVolumeUl: number;
  readonly dilutionFactor: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.stockHauPerReferenceVolume, "stockHauPerReferenceVolume");
  positive(input.referenceVolumeUl, "referenceVolumeUl");
  positive(input.targetHau, "targetHau");
  positive(input.targetReactionVolumeUl, "targetReactionVolumeUl");
  const stockVolumeUl =
    (input.targetHau * input.referenceVolumeUl) /
    input.stockHauPerReferenceVolume;
  if (stockVolumeUl > input.targetReactionVolumeUl)
    simpleError(
      "targetHau",
      "Requested antigen units cannot be reached by dilution to this volume.",
    );
  return {
    stockVolumeUl,
    diluentVolumeUl: input.targetReactionVolumeUl - stockVolumeUl,
    dilutionFactor: input.targetReactionVolumeUl / stockVolumeUl,
  };
};
export const exampleInput = {
  stockHauPerReferenceVolume: 64,
  referenceVolumeUl: 25,
  targetHau: 4,
  targetReactionVolumeUl: 25,
} satisfies Input;
export const exampleOutput = {
  stockVolumeUl: 1.5625,
  diluentVolumeUl: 23.4375,
  dilutionFactor: 16,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/hai-antigen-unit-standardization",
  title: "HAI Antigen Unit Standardization",
  description:
    "Prepare a caller-specified HAI antigen-unit input by volume dilution of a measured HA stock; assay-specific validation remains required.",
  inputs: [
    {
      id: "stockHauPerReferenceVolume",
      label: "Stock hau per reference volume",
      kind: "number",
    },
    { id: "referenceVolumeUl", label: "Reference volume ul", kind: "number" },
    { id: "targetHau", label: "Target hau", kind: "number" },
    {
      id: "targetReactionVolumeUl",
      label: "Target reaction volume ul",
      kind: "number",
    },
  ],
  outputs: [
    { id: "stockVolumeUl", label: "Stock volume ul", kind: "number" },
    { id: "diluentVolumeUl", label: "Diluent volume ul", kind: "number" },
    { id: "dilutionFactor", label: "Dilution factor", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      stockHauPerReferenceVolume: value.stockHauPerReferenceVolume as number,
      referenceVolumeUl: value.referenceVolumeUl as number,
      targetHau: value.targetHau as number,
      targetReactionVolumeUl: value.targetReactionVolumeUl as number,
    }),
});
export const run = tool.execute;
export default tool;
