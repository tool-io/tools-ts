import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly observableExpectedJointCount: number;
  readonly observedArticulatedJointCount: number;
  readonly unassessableExpectedJointCount: number;
}>;
export type Output = Readonly<{
  readonly observableArticulationIndex: number;
  readonly fullExpectedJointArticulationBounds: readonly number[];
}>;
const inputFields = [
  {
    id: "observableExpectedJointCount",
    label: "Observable expected joint count",
    kind: "integer",
  },
  {
    id: "observedArticulatedJointCount",
    label: "Observed articulated joint count",
    kind: "integer",
  },
  {
    id: "unassessableExpectedJointCount",
    label: "Unassessable expected joint count",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observableExpectedJointCount, "observableExpectedJointCount");
  count(input.observableExpectedJointCount, "observableExpectedJointCount");
  count(input.observedArticulatedJointCount, "observedArticulatedJointCount");
  count(input.unassessableExpectedJointCount, "unassessableExpectedJointCount");
  if (input.observedArticulatedJointCount > input.observableExpectedJointCount)
    simpleError(
      "observedArticulatedJointCount",
      "Articulated joints cannot exceed assessable joint opportunities.",
    );
  const full =
    input.observableExpectedJointCount + input.unassessableExpectedJointCount;
  return {
    observableArticulationIndex:
      input.observedArticulatedJointCount / input.observableExpectedJointCount,
    fullExpectedJointArticulationBounds: [
      input.observedArticulatedJointCount / full,
      (input.observedArticulatedJointCount +
        input.unassessableExpectedJointCount) /
        full,
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observableExpectedJointCount: 10,
  observedArticulatedJointCount: 4,
  unassessableExpectedJointCount: 5,
} satisfies Input;
export const exampleOutput = {
  observableArticulationIndex: 0.4,
  fullExpectedJointArticulationBounds: [0.26666666666666666, 0.6],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/articulation-index-skeleton",
  title: "Articulation Index Skeleton",
  description:
    "Compute observed articulation fraction over assessable expected joints and extreme bounds for unassessable opportunities; denominator is joint opportunities, not surviving bones.",
  inputs: inputFields,
  outputs: [
    {
      id: "observableArticulationIndex",
      label: "Observable articulation index",
      kind: "number",
    },
    {
      id: "fullExpectedJointArticulationBounds",
      label: "Full expected joint articulation bounds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observableExpectedJointCount:
        value.observableExpectedJointCount as number,
      observedArticulatedJointCount:
        value.observedArticulatedJointCount as number,
      unassessableExpectedJointCount:
        value.unassessableExpectedJointCount as number,
    }),
});
export const run = tool.execute;
export default tool;
