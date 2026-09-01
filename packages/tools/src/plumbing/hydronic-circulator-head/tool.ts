import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly hydronicBranchIds: readonly string[];
  readonly observedDesignBranchDistributedLossM: readonly number[];
  readonly observedDesignBranchValveLossM: readonly number[];
  readonly observedSharedPrimaryHeadLossM: number;
}>;
export type Output = Readonly<{
  readonly designBranchHeadsM: readonly number[];
  readonly requiredParallelHydronicCirculatorHeadM: number;
  readonly controllingHydronicBranchIds: readonly string[];
}>;
const inputFields = [
  { id: "hydronicBranchIds", label: "Hydronic branch ids", kind: "stringList" },
  {
    id: "observedDesignBranchDistributedLossM",
    label: "Observed design branch distributed loss m",
    kind: "numberList",
  },
  {
    id: "observedDesignBranchValveLossM",
    label: "Observed design branch valve loss m",
    kind: "numberList",
  },
  {
    id: "observedSharedPrimaryHeadLossM",
    label: "Observed shared primary head loss m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDesignBranchDistributedLossM.forEach((v) =>
    nonnegative(v, "observedDesignBranchDistributedLossM"),
  );
  input.observedDesignBranchValveLossM.forEach((v) =>
    nonnegative(v, "observedDesignBranchValveLossM"),
  );
  nonnegative(
    input.observedSharedPrimaryHeadLossM,
    "observedSharedPrimaryHeadLossM",
  );
  aligned(
    input.hydronicBranchIds,
    input.observedDesignBranchDistributedLossM,
    "hydronicBranchIds",
  );
  aligned(
    input.hydronicBranchIds,
    input.observedDesignBranchValveLossM,
    "hydronicBranchIds",
  );
  unique(input.hydronicBranchIds, "branches");
  const heads = input.observedDesignBranchDistributedLossM.map(
      (v, i) => v + input.observedDesignBranchValveLossM[i],
    ),
    maximum = Math.max(...heads);
  return {
    designBranchHeadsM: heads,
    requiredParallelHydronicCirculatorHeadM:
      maximum + input.observedSharedPrimaryHeadLossM,
    controllingHydronicBranchIds: input.hydronicBranchIds.filter(
      (_, i) => heads[i] === maximum,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  hydronicBranchIds: ["a", "b"],
  observedDesignBranchDistributedLossM: [2, 4],
  observedDesignBranchValveLossM: [1, 2],
  observedSharedPrimaryHeadLossM: 1,
} satisfies Input;
export const exampleOutput = {
  designBranchHeadsM: [3, 6],
  requiredParallelHydronicCirculatorHeadM: 7,
  controllingHydronicBranchIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/hydronic-circulator-head",
  title: "Plumbing Hydronic Circulator Head Calculator",
  description:
    "Reconcile actual parallel hydronic branch design losses plus independent shared primary loss, no summing parallel heads or closed-loop static elevation; not a network balance/installed pump approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "designBranchHeadsM",
      label: "Design branch heads m",
      kind: "numberList",
    },
    {
      id: "requiredParallelHydronicCirculatorHeadM",
      label: "Required parallel hydronic circulator head m",
      kind: "number",
    },
    {
      id: "controllingHydronicBranchIds",
      label: "Controlling hydronic branch ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      hydronicBranchIds: value.hydronicBranchIds as readonly string[],
      observedDesignBranchDistributedLossM:
        value.observedDesignBranchDistributedLossM as readonly number[],
      observedDesignBranchValveLossM:
        value.observedDesignBranchValveLossM as readonly number[],
      observedSharedPrimaryHeadLossM:
        value.observedSharedPrimaryHeadLossM as number,
    }),
});
export const run = tool.execute;
export default tool;
