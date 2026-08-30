import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bondSizeTerm,
} from "../shared.js";
export type Input = Readonly<{
  readonly workIndexKwhPerTonne: number;
  readonly feedP80Micrometers: number;
  readonly productP80Micrometers: number;
  readonly correctionFactors: readonly number[];
  readonly throughputTonnesPerHour: number;
}>;
export type Output = Readonly<{
  readonly netSpecificEnergyKwhPerTonne: number;
  readonly netPowerKw: number;
}>;
const inputFields = [
  {
    id: "workIndexKwhPerTonne",
    label: "Work index kwh per tonne",
    kind: "number",
  },
  { id: "feedP80Micrometers", label: "Feed p80 micrometers", kind: "number" },
  {
    id: "productP80Micrometers",
    label: "Product p80 micrometers",
    kind: "number",
  },
  { id: "correctionFactors", label: "Correction factors", kind: "numberList" },
  {
    id: "throughputTonnesPerHour",
    label: "Throughput tonnes per hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.workIndexKwhPerTonne, "workIndexKwhPerTonne");
  input.correctionFactors.forEach((v) => positive(v, "correctionFactors"));
  nonnegative(input.throughputTonnesPerHour, "throughputTonnesPerHour");
  if (!input.correctionFactors.length)
    simpleError("correctionFactors", "Nonempty correction factors required.");
  const netSpecificEnergyKwhPerTonne =
    input.workIndexKwhPerTonne *
    bondSizeTerm(input.feedP80Micrometers, input.productP80Micrometers) *
    input.correctionFactors.reduce((a, b) => a * b, 1);
  return {
    netSpecificEnergyKwhPerTonne,
    netPowerKw: netSpecificEnergyKwhPerTonne * input.throughputTonnesPerHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  workIndexKwhPerTonne: 10,
  feedP80Micrometers: 10000,
  productP80Micrometers: 100,
  correctionFactors: [1, 1.2],
  throughputTonnesPerHour: 100,
} satisfies Input;
export const exampleOutput = {
  netSpecificEnergyKwhPerTonne: 10.8,
  netPowerKw: 1080,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/comminution-energy",
  title: "Comminution Energy",
  description:
    "Predict corrected Bond net energy and power for supplied throughput; no-load mill power and hardware sizing are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "netSpecificEnergyKwhPerTonne",
      label: "Net specific energy kwh per tonne",
      kind: "number",
    },
    { id: "netPowerKw", label: "Net power kw", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      workIndexKwhPerTonne: value.workIndexKwhPerTonne as number,
      feedP80Micrometers: value.feedP80Micrometers as number,
      productP80Micrometers: value.productP80Micrometers as number,
      correctionFactors: value.correctionFactors as readonly number[],
      throughputTonnesPerHour: value.throughputTonnesPerHour as number,
    }),
});
export const run = tool.execute;
export default tool;
