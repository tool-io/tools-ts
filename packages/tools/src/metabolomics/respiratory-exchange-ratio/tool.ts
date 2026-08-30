import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly co2OutputLiters: number;
  readonly oxygenUptakeLiters: number;
  readonly lowRerCutoff: number;
  readonly highRerCutoff: number;
}>;
export type Output = Readonly<{
  readonly rer: number;
  readonly fuelClass: string;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.co2OutputLiters < 0 ||
    input.oxygenUptakeLiters <= 0 ||
    input.lowRerCutoff > input.highRerCutoff
  )
    simpleError(
      "oxygenUptakeLiters",
      "Positive VO2 and ordered RER cutoffs required.",
    );
  const rer = input.co2OutputLiters / input.oxygenUptakeLiters;
  return {
    rer,
    fuelClass:
      rer < input.lowRerCutoff
        ? "fat-leaning"
        : rer > input.highRerCutoff
          ? "carbohydrate-leaning"
          : "mixed",
  };
};
export const exampleInput = {
  co2OutputLiters: 1,
  oxygenUptakeLiters: 2,
  lowRerCutoff: 0.7,
  highRerCutoff: 0.9,
} satisfies Input;
export const exampleOutput = {
  rer: 0.5,
  fuelClass: "fat-leaning",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/respiratory-exchange-ratio",
  title: "Respiratory Exchange Ratio",
  description:
    "Classify respiratory exchange ratio against caller-provided fuel bands.",
  inputs: [
    { id: "co2OutputLiters", kind: "number", label: "Co 2 output liters" },
    { id: "oxygenUptakeLiters", kind: "number", label: "Oxygen uptake liters" },
    { id: "lowRerCutoff", kind: "number", label: "Low rer cutoff" },
    { id: "highRerCutoff", kind: "number", label: "High rer cutoff" },
  ],
  outputs: [
    { id: "rer", kind: "number", label: "Rer" },
    { id: "fuelClass", kind: "string", label: "Fuel class" },
  ],
  calculate: (value) =>
    calculate({
      co2OutputLiters: value.co2OutputLiters as number,
      oxygenUptakeLiters: value.oxygenUptakeLiters as number,
      lowRerCutoff: value.lowRerCutoff as number,
      highRerCutoff: value.highRerCutoff as number,
    }),
});
export const run = tool.execute;
export default tool;
