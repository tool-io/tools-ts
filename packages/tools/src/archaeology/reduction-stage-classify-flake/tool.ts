import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  count,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly flakeCortexFractions: readonly number[];
  readonly callerStageLowerEdges: readonly number[];
  readonly callerStageCodes: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerReductionStageCodes: readonly number[];
}>;
const inputFields = [
  {
    id: "flakeCortexFractions",
    label: "Flake cortex fractions",
    kind: "numberList",
  },
  {
    id: "callerStageLowerEdges",
    label: "Caller stage lower edges",
    kind: "numberList",
  },
  { id: "callerStageCodes", label: "Caller stage codes", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.flakeCortexFractions.forEach((v) =>
    fraction(v, "flakeCortexFractions"),
  );
  input.callerStageLowerEdges.forEach((v) =>
    fraction(v, "callerStageLowerEdges"),
  );
  input.callerStageCodes.forEach((v) => count(v, "callerStageCodes"));
  ordered(input.callerStageLowerEdges, "callerStageLowerEdges");
  aligned(input.callerStageLowerEdges, input.callerStageCodes, "stages");
  if (
    input.callerStageLowerEdges[0] !== 0 ||
    input.callerStageLowerEdges.length > 128
  )
    simpleError(
      "stages",
      "At most 128 ordered stage edges beginning at zero required.",
    );
  return {
    callerReductionStageCodes: input.flakeCortexFractions.map((v) => {
      const i = input.callerStageLowerEdges.findIndex((x) => x > v);
      return input.callerStageCodes[
        i < 0 ? input.callerStageCodes.length - 1 : i - 1
      ];
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  flakeCortexFractions: [0, 0.5, 1],
  callerStageLowerEdges: [0, 0.3, 0.7],
  callerStageCodes: [3, 2, 1],
} satisfies Input;
export const exampleOutput = {
  callerReductionStageCodes: [3, 2, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/reduction-stage-classify-flake",
  title: "Flake Reduction Stage Classifier",
  description:
    "Apply explicit caller cortex-band reduction-stage codes without a universal lithic technology rule; cortex alone does not establish the true manufacturing stage.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerReductionStageCodes",
      label: "Caller reduction stage codes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      flakeCortexFractions: value.flakeCortexFractions as readonly number[],
      callerStageLowerEdges: value.callerStageLowerEdges as readonly number[],
      callerStageCodes: value.callerStageCodes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
