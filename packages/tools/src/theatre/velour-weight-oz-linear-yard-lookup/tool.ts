import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerMeasuredVelourOzPerSquareYard: number;
  readonly rollWidthYards: number;
  readonly purchaseLinearYards: number;
}>;
export type Output = Readonly<{
  readonly velourOuncesPerLinearYard: number;
  readonly totalFabricMassOz: number;
}>;
const inputFields = [
  {
    id: "callerMeasuredVelourOzPerSquareYard",
    label: "Caller measured velour oz per square yard",
    kind: "number",
  },
  { id: "rollWidthYards", label: "Roll width yards", kind: "number" },
  { id: "purchaseLinearYards", label: "Purchase linear yards", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMeasuredVelourOzPerSquareYard,
    "callerMeasuredVelourOzPerSquareYard",
  );
  positive(input.rollWidthYards, "rollWidthYards");
  nonnegative(input.purchaseLinearYards, "purchaseLinearYards");
  const per = input.callerMeasuredVelourOzPerSquareYard * input.rollWidthYards;
  return {
    velourOuncesPerLinearYard: per,
    totalFabricMassOz: per * input.purchaseLinearYards,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMeasuredVelourOzPerSquareYard: 16,
  rollWidthYards: 2,
  purchaseLinearYards: 10,
} satisfies Input;
export const exampleOutput = {
  velourOuncesPerLinearYard: 32,
  totalFabricMassOz: 320,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/velour-weight-oz-linear-yard-lookup",
  title: "Velour Weight Oz Linear Yard Lookup",
  description:
    "Distinguish actual velour area weight from width-dependent linear-yard mass and inventory total; no universal trade-weight conversion, rigging weight rating or fabric catalogue invention.",
  inputs: inputFields,
  outputs: [
    {
      id: "velourOuncesPerLinearYard",
      label: "Velour ounces per linear yard",
      kind: "number",
    },
    { id: "totalFabricMassOz", label: "Total fabric mass oz", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      callerMeasuredVelourOzPerSquareYard:
        value.callerMeasuredVelourOzPerSquareYard as number,
      rollWidthYards: value.rollWidthYards as number,
      purchaseLinearYards: value.purchaseLinearYards as number,
    }),
});
export const run = tool.execute;
export default tool;
