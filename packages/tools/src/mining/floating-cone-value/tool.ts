import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count } from "../shared.js";
export type Input = Readonly<{
  readonly blockValues: readonly number[];
  readonly coneBlockIndexes: readonly number[];
  readonly alreadyMinedBlockIndexes: readonly number[];
}>;
export type Output = Readonly<{
  readonly incrementalConeValue: number;
  readonly includedUnminedBlockIndexes: readonly number[];
  readonly positiveIncrementalCone: boolean;
}>;
const inputFields = [
  { id: "blockValues", label: "Block values", kind: "numberList" },
  { id: "coneBlockIndexes", label: "Cone block indexes", kind: "numberList" },
  {
    id: "alreadyMinedBlockIndexes",
    label: "Already mined block indexes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.blockValues.length || !input.coneBlockIndexes.length)
    simpleError(
      "coneBlockIndexes",
      "Nonempty blocks and predefined cone required.",
    );
  for (const row of [input.coneBlockIndexes, input.alreadyMinedBlockIndexes]) {
    if (new Set(row).size !== row.length)
      simpleError("coneBlockIndexes", "Unique block indexes required.");
    row.forEach((v) => {
      count(v, "blockIndexes");
      if (v >= input.blockValues.length)
        simpleError("blockIndexes", "Index outside blocks.");
    });
  }
  const mined = new Set(input.alreadyMinedBlockIndexes),
    includedUnminedBlockIndexes = input.coneBlockIndexes.filter(
      (i) => !mined.has(i),
    ),
    incrementalConeValue = includedUnminedBlockIndexes.reduce(
      (s, i) => s + input.blockValues[i],
      0,
    );
  return {
    incrementalConeValue,
    includedUnminedBlockIndexes,
    positiveIncrementalCone: incrementalConeValue > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  blockValues: [100, -20, -30, 40],
  coneBlockIndexes: [0, 1, 2],
  alreadyMinedBlockIndexes: [1],
} satisfies Input;
export const exampleOutput = {
  incrementalConeValue: 70,
  includedUnminedBlockIndexes: [0, 2],
  positiveIncrementalCone: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/floating-cone-value",
  title: "Floating Cone Value",
  description:
    "Evaluate incremental value of a predefined floating cone excluding mined blocks; does not construct cone geometry or optimize pits.",
  inputs: inputFields,
  outputs: [
    {
      id: "incrementalConeValue",
      label: "Incremental cone value",
      kind: "number",
    },
    {
      id: "includedUnminedBlockIndexes",
      label: "Included unmined block indexes",
      kind: "numberList",
    },
    {
      id: "positiveIncrementalCone",
      label: "Positive incremental cone",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      blockValues: value.blockValues as readonly number[],
      coneBlockIndexes: value.coneBlockIndexes as readonly number[],
      alreadyMinedBlockIndexes:
        value.alreadyMinedBlockIndexes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
