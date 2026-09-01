import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  capacity,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerRoofDrainIds: readonly string[];
  readonly callerMatchedRoofDrainCapacityLitersSecond: readonly number[];
  readonly observedDesignRoofRunoffLitersSecond: number;
}>;
export type Output = Readonly<{
  readonly callerCompatibleCandidateIds: readonly string[];
  readonly signedCandidateCapacityMarginsLitersSecond: readonly number[];
}>;
const inputFields = [
  {
    id: "callerRoofDrainIds",
    label: "Caller roof drain ids",
    kind: "stringList",
  },
  {
    id: "callerMatchedRoofDrainCapacityLitersSecond",
    label: "Caller matched roof drain capacity liters second",
    kind: "numberList",
  },
  {
    id: "observedDesignRoofRunoffLitersSecond",
    label: "Observed design roof runoff liters second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedRoofDrainCapacityLitersSecond.forEach((v) =>
    nonnegative(v, "callerMatchedRoofDrainCapacityLitersSecond"),
  );
  nonnegative(
    input.observedDesignRoofRunoffLitersSecond,
    "observedDesignRoofRunoffLitersSecond",
  );
  return {
    callerCompatibleCandidateIds: capacity(
      input.callerRoofDrainIds,
      input.callerMatchedRoofDrainCapacityLitersSecond,
      input.observedDesignRoofRunoffLitersSecond,
    ),
    signedCandidateCapacityMarginsLitersSecond:
      input.callerMatchedRoofDrainCapacityLitersSecond.map(
        (v) => v - input.observedDesignRoofRunoffLitersSecond,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRoofDrainIds: ["a", "b", "c"],
  callerMatchedRoofDrainCapacityLitersSecond: [5, 10, 20],
  observedDesignRoofRunoffLitersSecond: 8,
} satisfies Input;
export const exampleOutput = {
  callerCompatibleCandidateIds: ["b", "c"],
  signedCandidateCapacityMarginsLitersSecond: [-3, 2, 12],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/roof-drain-size",
  title: "Plumbing Roof Drain Size Calculator",
  description:
    "Screen actual primary roof drain demand against independently verified matched head/slope candidate capacities; no universal rainfall, pipe code table or flood protection approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCompatibleCandidateIds",
      label: "Caller compatible candidate ids",
      kind: "stringList",
    },
    {
      id: "signedCandidateCapacityMarginsLitersSecond",
      label: "Signed candidate capacity margins liters second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRoofDrainIds: value.callerRoofDrainIds as readonly string[],
      callerMatchedRoofDrainCapacityLitersSecond:
        value.callerMatchedRoofDrainCapacityLitersSecond as readonly number[],
      observedDesignRoofRunoffLitersSecond:
        value.observedDesignRoofRunoffLitersSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
