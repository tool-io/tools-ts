import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredNarrowbandWidthHz: number;
  readonly independentlyMeasuredChannelWidthHz: number;
  readonly callerNarrowFeatureLimitHz: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredNarrowbandWidthHz",
    label: "Independently measured narrowband width hz",
    kind: "number",
  },
  {
    id: "independentlyMeasuredChannelWidthHz",
    label: "Independently measured channel width hz",
    kind: "number",
  },
  {
    id: "callerNarrowFeatureLimitHz",
    label: "Caller narrow feature limit hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredNarrowbandWidthHz, "width");
  positive(input.independentlyMeasuredChannelWidthHz, "resolution");
  positive(input.callerNarrowFeatureLimitHz, "limit");
  return {
    meetsCallerWidthScreen:
      input.independentlyMeasuredNarrowbandWidthHz <=
      input.callerNarrowFeatureLimitHz,
    spectrallyResolved:
      input.independentlyMeasuredNarrowbandWidthHz >
      input.independentlyMeasuredChannelWidthHz,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredNarrowbandWidthHz: 1,
    independentlyMeasuredChannelWidthHz: 2,
    callerNarrowFeatureLimitHz: 3,
  },
  output: {
    result: { meetsCallerWidthScreen: true, spectrallyResolved: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/narrowband-artificiality-classifier",
  title: "Technosignature Narrowband Width Hz Artificiality Classifier",
  description:
    "Actual narrowband width screen retaining whether width exceeds channel resolution; not classify artificial origin, exclude terrestrial interference or identify an extraterrestrial transmitter.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
