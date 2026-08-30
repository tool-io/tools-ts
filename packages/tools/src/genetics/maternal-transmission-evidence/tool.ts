import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { aligned } from "../shared.js";

export type Input = Readonly<{
  readonly transmittingParentSexes: readonly string[];
  readonly offspringSexes: readonly string[];
}>;
export type Output = Readonly<{
  readonly maternalTransmissionCount: number;
  readonly paternalTransmissionIndexes: readonly number[];
  readonly maternalOnlyObserved: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(
    input.transmittingParentSexes,
    input.offspringSexes,
    "transmittingParentSexes",
  );
  if (
    [...input.transmittingParentSexes, ...input.offspringSexes].some(
      (v) => v !== "male" && v !== "female",
    )
  )
    simpleError(
      "transmittingParentSexes",
      "Use explicit male/female sex labels for documented transmission edges.",
    );
  const paternalTransmissionIndexes = input.transmittingParentSexes.flatMap(
    (v, i) => (v === "male" ? [i] : []),
  );
  return {
    maternalTransmissionCount:
      input.transmittingParentSexes.length - paternalTransmissionIndexes.length,
    paternalTransmissionIndexes,
    maternalOnlyObserved: paternalTransmissionIndexes.length === 0,
  };
};
export const exampleInput = {
  transmittingParentSexes: ["female", "female", "male"],
  offspringSexes: ["male", "female", "male"],
} satisfies Input;
export const exampleOutput = {
  maternalTransmissionCount: 2,
  paternalTransmissionIndexes: [2],
  maternalOnlyObserved: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/maternal-transmission-evidence",
  title: "Maternal Transmission Evidence",
  description:
    "Audit documented transmission edges for maternal-only inheritance, without establishing mitochondrial causation.",
  inputs: [
    {
      id: "transmittingParentSexes",
      label: "Transmitting parent sexes",
      kind: "stringList",
    },
    { id: "offspringSexes", label: "Offspring sexes", kind: "stringList" },
  ],
  outputs: [
    {
      id: "maternalTransmissionCount",
      label: "Maternal transmission count",
      kind: "number",
    },
    {
      id: "paternalTransmissionIndexes",
      label: "Paternal transmission indexes",
      kind: "numberList",
    },
    {
      id: "maternalOnlyObserved",
      label: "Maternal only observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      transmittingParentSexes:
        value.transmittingParentSexes as readonly string[],
      offspringSexes: value.offspringSexes as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
