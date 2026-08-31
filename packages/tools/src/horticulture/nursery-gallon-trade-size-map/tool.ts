import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  catalogIndex,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerTradeSizeLabels: readonly string[];
  readonly callerVerifiedInteriorLiters: readonly number[];
  readonly queryTradeSizeLabel: string;
  readonly observedInteriorLiters: number;
}>;
export type Output = Readonly<{
  readonly callerVerifiedTradeContainerLiters: number;
  readonly signedMeasuredMinusVerifiedLiters: number;
}>;
const inputFields = [
  {
    id: "callerTradeSizeLabels",
    label: "Caller trade size labels",
    kind: "stringList",
  },
  {
    id: "callerVerifiedInteriorLiters",
    label: "Caller verified interior liters",
    kind: "numberList",
  },
  {
    id: "queryTradeSizeLabel",
    label: "Query trade size label",
    kind: "string",
  },
  {
    id: "observedInteriorLiters",
    label: "Observed interior liters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedInteriorLiters.forEach((v) =>
    positive(v, "callerVerifiedInteriorLiters"),
  );
  positive(input.observedInteriorLiters, "observedInteriorLiters");
  aligned(
    input.callerTradeSizeLabels,
    input.callerVerifiedInteriorLiters,
    "callerTradeSizeLabels",
  );
  const i = catalogIndex(
    input.callerTradeSizeLabels,
    input.queryTradeSizeLabel,
  );
  return {
    callerVerifiedTradeContainerLiters: input.callerVerifiedInteriorLiters[i],
    signedMeasuredMinusVerifiedLiters:
      input.observedInteriorLiters - input.callerVerifiedInteriorLiters[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTradeSizeLabels: ["#1", "#2"],
  callerVerifiedInteriorLiters: [2.5, 5],
  queryTradeSizeLabel: "#1",
  observedInteriorLiters: 3,
} satisfies Input;
export const exampleOutput = {
  callerVerifiedTradeContainerLiters: 2.5,
  signedMeasuredMinusVerifiedLiters: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/nursery-gallon-trade-size-map",
  title: "Nursery Gallon Trade Size Map",
  description:
    "Read exact caller trade-container measured-volume map and compare actual volume; trade gallon label is not US/imperial gallon conversion and no universal SKU capacity is invented.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerVerifiedTradeContainerLiters",
      label: "Caller verified trade container liters",
      kind: "number",
    },
    {
      id: "signedMeasuredMinusVerifiedLiters",
      label: "Signed measured minus verified liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTradeSizeLabels: value.callerTradeSizeLabels as readonly string[],
      callerVerifiedInteriorLiters:
        value.callerVerifiedInteriorLiters as readonly number[],
      queryTradeSizeLabel: value.queryTradeSizeLabel as string,
      observedInteriorLiters: value.observedInteriorLiters as number,
    }),
});
export const run = tool.execute;
export default tool;
