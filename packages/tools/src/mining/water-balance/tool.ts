import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly initialWaterInventoryM3: number;
  readonly externalInflowsM3: readonly number[];
  readonly externalOutflowsM3: readonly number[];
  readonly targetInventoryM3: number;
}>;
export type Output = Readonly<{
  readonly finalInventoryM3: number;
  readonly netExternalChangeM3: number;
  readonly additionalMakeupM3: number;
  readonly excessAboveTargetM3: number;
}>;
const inputFields = [
  {
    id: "initialWaterInventoryM3",
    label: "Initial water inventory m3",
    kind: "number",
  },
  { id: "externalInflowsM3", label: "External inflows m3", kind: "numberList" },
  {
    id: "externalOutflowsM3",
    label: "External outflows m3",
    kind: "numberList",
  },
  { id: "targetInventoryM3", label: "Target inventory m3", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.initialWaterInventoryM3, "initialWaterInventoryM3");
  input.externalInflowsM3.forEach((v) => nonnegative(v, "externalInflowsM3"));
  input.externalOutflowsM3.forEach((v) => nonnegative(v, "externalOutflowsM3"));
  nonnegative(input.targetInventoryM3, "targetInventoryM3");
  const netExternalChangeM3 =
      input.externalInflowsM3.reduce((a, b) => a + b, 0) -
      input.externalOutflowsM3.reduce((a, b) => a + b, 0),
    finalInventoryM3 = nonnegative(
      input.initialWaterInventoryM3 + netExternalChangeM3,
      "externalOutflowsM3",
    );
  return {
    finalInventoryM3,
    netExternalChangeM3,
    additionalMakeupM3: Math.max(0, input.targetInventoryM3 - finalInventoryM3),
    excessAboveTargetM3: Math.max(
      0,
      finalInventoryM3 - input.targetInventoryM3,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialWaterInventoryM3: 100,
  externalInflowsM3: [10, 20],
  externalOutflowsM3: [15, 5],
  targetInventoryM3: 120,
} satisfies Input;
export const exampleOutput = {
  finalInventoryM3: 110,
  netExternalChangeM3: 10,
  additionalMakeupM3: 10,
  excessAboveTargetM3: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/water-balance",
  title: "Water Balance",
  description:
    "Close site external water inventory and report makeup/excess against target; internal recirculation must not be double counted.",
  inputs: inputFields,
  outputs: [
    { id: "finalInventoryM3", label: "Final inventory m3", kind: "number" },
    {
      id: "netExternalChangeM3",
      label: "Net external change m3",
      kind: "number",
    },
    { id: "additionalMakeupM3", label: "Additional makeup m3", kind: "number" },
    {
      id: "excessAboveTargetM3",
      label: "Excess above target m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialWaterInventoryM3: value.initialWaterInventoryM3 as number,
      externalInflowsM3: value.externalInflowsM3 as readonly number[],
      externalOutflowsM3: value.externalOutflowsM3 as readonly number[],
      targetInventoryM3: value.targetInventoryM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
