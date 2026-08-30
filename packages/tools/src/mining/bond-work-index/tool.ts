import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bondSizeTerm,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredSpecificEnergyKwhPerTonne: number;
  readonly feedP80Micrometers: number;
  readonly productP80Micrometers: number;
}>;
export type Output = Readonly<{
  readonly inferredWorkIndexKwhPerTonne: number;
}>;
const inputFields = [
  {
    id: "measuredSpecificEnergyKwhPerTonne",
    label: "Measured specific energy kwh per tonne",
    kind: "number",
  },
  { id: "feedP80Micrometers", label: "Feed p80 micrometers", kind: "number" },
  {
    id: "productP80Micrometers",
    label: "Product p80 micrometers",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.measuredSpecificEnergyKwhPerTonne,
    "measuredSpecificEnergyKwhPerTonne",
  );
  return {
    inferredWorkIndexKwhPerTonne:
      input.measuredSpecificEnergyKwhPerTonne /
      positive(
        bondSizeTerm(input.feedP80Micrometers, input.productP80Micrometers),
        "model",
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredSpecificEnergyKwhPerTonne: 10,
  feedP80Micrometers: 10000,
  productP80Micrometers: 100,
} satisfies Input;
export const exampleOutput = {
  inferredWorkIndexKwhPerTonne: 11.11111111111111,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/bond-work-index",
  title: "Bond Work Index",
  description:
    "Infer Bond work index from measured net specific energy and feed/product P80; distinct from the laboratory ball-mill test correlation.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredWorkIndexKwhPerTonne",
      label: "Inferred work index kwh per tonne",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredSpecificEnergyKwhPerTonne:
        value.measuredSpecificEnergyKwhPerTonne as number,
      feedP80Micrometers: value.feedP80Micrometers as number,
      productP80Micrometers: value.productP80Micrometers as number,
    }),
});
export const run = tool.execute;
export default tool;
