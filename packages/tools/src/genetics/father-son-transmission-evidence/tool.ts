import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { aligned } from "../shared.js";

export type Input = Readonly<{
  readonly parentSexes: readonly string[];
  readonly childSexes: readonly string[];
}>;
export type Output = Readonly<{
  readonly fatherSonCount: number;
  readonly inconsistentEdgeIndexes: readonly number[];
  readonly fatherSonOnlyObserved: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.parentSexes, input.childSexes, "parentSexes");
  if (
    [...input.parentSexes, ...input.childSexes].some(
      (v) => v !== "male" && v !== "female",
    )
  )
    simpleError(
      "parentSexes",
      "Male/female labels required on documented transmission edges.",
    );
  const inconsistentEdgeIndexes = input.parentSexes.flatMap((v, i) =>
    v === "male" && input.childSexes[i] === "male" ? [] : [i],
  );
  return {
    fatherSonCount: input.parentSexes.length - inconsistentEdgeIndexes.length,
    inconsistentEdgeIndexes,
    fatherSonOnlyObserved: inconsistentEdgeIndexes.length === 0,
  };
};
export const exampleInput = {
  parentSexes: ["male", "male", "female"],
  childSexes: ["male", "female", "male"],
} satisfies Input;
export const exampleOutput = {
  fatherSonCount: 1,
  inconsistentEdgeIndexes: [1, 2],
  fatherSonOnlyObserved: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/father-son-transmission-evidence",
  title: "Father Son Transmission Evidence",
  description:
    "Audit whether documented transmission edges are exclusively father-to-son.",
  inputs: [
    { id: "parentSexes", label: "Parent sexes", kind: "stringList" },
    { id: "childSexes", label: "Child sexes", kind: "stringList" },
  ],
  outputs: [
    { id: "fatherSonCount", label: "Father son count", kind: "number" },
    {
      id: "inconsistentEdgeIndexes",
      label: "Inconsistent edge indexes",
      kind: "numberList",
    },
    {
      id: "fatherSonOnlyObserved",
      label: "Father son only observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      parentSexes: value.parentSexes as readonly string[],
      childSexes: value.childSexes as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
