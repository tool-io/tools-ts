import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly freezingPointDepressionC: number;
  readonly referenceDepressionPerOsmolC: number;
}>;
export type Output = Readonly<{
  readonly osmolalityMmolKg: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.freezingPointDepressionC < 0 ||
    input.referenceDepressionPerOsmolC <= 0
  )
    simpleError(
      "referenceDepressionPerOsmolC",
      "Positive calibration and nonnegative freezing depression required.",
    );
  return {
    osmolalityMmolKg:
      (input.freezingPointDepressionC / input.referenceDepressionPerOsmolC) *
      1000,
  };
};
export const exampleInput = {
  freezingPointDepressionC: 1.86,
  referenceDepressionPerOsmolC: 1.86,
} satisfies Input;
export const exampleOutput = { osmolalityMmolKg: 1000 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/freezing-point-osmolality",
  title: "Freezing Point Osmolality",
  description:
    "Estimate osmolality by a caller-calibrated freezing-point depression.",
  inputs: [
    {
      id: "freezingPointDepressionC",
      kind: "number",
      label: "Freezing point depression c",
    },
    {
      id: "referenceDepressionPerOsmolC",
      kind: "number",
      label: "Reference depression per osmol c",
    },
  ],
  outputs: [
    { id: "osmolalityMmolKg", kind: "number", label: "Osmolality mmol kg" },
  ],
  calculate: (value) =>
    calculate({
      freezingPointDepressionC: value.freezingPointDepressionC as number,
      referenceDepressionPerOsmolC:
        value.referenceDepressionPerOsmolC as number,
    }),
});
export const run = tool.execute;
export default tool;
