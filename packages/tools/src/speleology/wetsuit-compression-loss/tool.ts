import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualSurfaceWetsuitThicknessMm: number;
  readonly callerManufacturerMatchedRetainedThicknessFractionAtActualDepth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSurfaceWetsuitThicknessMm",
    label: "Actual surface wetsuit thickness mm",
    kind: "number",
  },
  {
    id: "callerManufacturerMatchedRetainedThicknessFractionAtActualDepth",
    label:
      "Caller manufacturer matched retained thickness fraction at actual depth",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualSurfaceWetsuitThicknessMm, "thickness");
  fraction(
    input.callerManufacturerMatchedRetainedThicknessFractionAtActualDepth,
    "retained",
  );
  return {
    conditionalCompressedWetsuitThicknessMm:
      input.actualSurfaceWetsuitThicknessMm *
      input.callerManufacturerMatchedRetainedThicknessFractionAtActualDepth,
    signedThicknessLossMm:
      input.actualSurfaceWetsuitThicknessMm *
      (1 -
        input.callerManufacturerMatchedRetainedThicknessFractionAtActualDepth),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSurfaceWetsuitThicknessMm: 5,
    callerManufacturerMatchedRetainedThicknessFractionAtActualDepth: 0.6,
  },
  output: {
    result: {
      conditionalCompressedWetsuitThicknessMm: 3,
      signedThicknessLossMm: 2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/wetsuit-compression-loss",
  title: "Wetsuit Compression Depth Thickness Loss Calculator",
  description:
    "Actual wetsuit thickness\u00d7independently matched manufacturer depth/compression factor; not Boylelawfor closed cells, thermal performance or safe dive depth.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
