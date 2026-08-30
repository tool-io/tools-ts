import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly topStrandCutIndex: number;
  readonly bottomStrandCutIndex: number;
  readonly duplexLength: number;
}>;
export type Output = Readonly<{
  readonly overhangBases: number;
  readonly endType: string;
}>;
export const calculate = (input: Input): Output => {
  count(input.duplexLength, "duplexLength", 1);
  count(input.topStrandCutIndex, "topStrandCutIndex");
  count(input.bottomStrandCutIndex, "bottomStrandCutIndex");
  if (
    Math.max(input.topStrandCutIndex, input.bottomStrandCutIndex) >
    input.duplexLength
  )
    simpleError(
      "topStrandCutIndex",
      "Both cut boundaries must fit the duplex.",
    );
  const delta = input.bottomStrandCutIndex - input.topStrandCutIndex;
  return {
    overhangBases: Math.abs(delta),
    endType: delta === 0 ? "blunt" : delta > 0 ? "5-prime" : "3-prime",
  };
};
export const exampleInput = {
  topStrandCutIndex: 1,
  bottomStrandCutIndex: 5,
  duplexLength: 6,
} satisfies Input;
export const exampleOutput = {
  overhangBases: 4,
  endType: "5-prime",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/restriction-overhang-type",
  title: "Restriction Overhang Type",
  description:
    "Decode staggered cut geometry on a top-strand left-to-right coordinate system.",
  inputs: [
    { id: "topStrandCutIndex", label: "Top strand cut index", kind: "integer" },
    {
      id: "bottomStrandCutIndex",
      label: "Bottom strand cut index",
      kind: "integer",
      description:
        "Cut boundary expressed on the same left-to-right axis as the top strand, not the bottom strand orientation.",
    },
    { id: "duplexLength", label: "Duplex length", kind: "integer" },
  ],
  outputs: [
    { id: "overhangBases", label: "Overhang bases", kind: "number" },
    { id: "endType", label: "End type", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      topStrandCutIndex: value.topStrandCutIndex as number,
      bottomStrandCutIndex: value.bottomStrandCutIndex as number,
      duplexLength: value.duplexLength as number,
    }),
});
export const run = tool.execute;
export default tool;
