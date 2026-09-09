import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedBracketSpacingMeters: number;
  readonly observedUniformShelfLoadNewtonsPerMeter: number;
  readonly callerEngineeredAllowableSimpleSpanMomentNewtonMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedBracketSpacingMeters",
    label: "Observed bracket spacing meters",
    kind: "number",
  },
  {
    id: "observedUniformShelfLoadNewtonsPerMeter",
    label: "Observed uniform shelf load newtons per meter",
    kind: "number",
  },
  {
    id: "callerEngineeredAllowableSimpleSpanMomentNewtonMeters",
    label: "Caller engineered allowable simple span moment newton meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.observedBracketSpacingMeters, "span");
  nonnegative(input.observedUniformShelfLoadNewtonsPerMeter, "load");
  positive(
    input.callerEngineeredAllowableSimpleSpanMomentNewtonMeters,
    "allowable",
  );
  const m =
    (input.observedUniformShelfLoadNewtonsPerMeter *
      input.observedBracketSpacingMeters ** 2) /
    8;
  return {
    conditionalSimpleSpanMaximumMomentNewtonMeters: m,
    signedAllowableMomentMarginNewtonMeters:
      input.callerEngineeredAllowableSimpleSpanMomentNewtonMeters - m,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedBracketSpacingMeters: 1,
    observedUniformShelfLoadNewtonsPerMeter: 100,
    callerEngineeredAllowableSimpleSpanMomentNewtonMeters: 20,
  },
  output: {
    result: {
      conditionalSimpleSpanMaximumMomentNewtonMeters: 12.5,
      signedAllowableMomentMarginNewtonMeters: 7.5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/shelf-load-bracket-spacing",
  title: "Shelf Load Capacity per Bracket Spacing Calculator",
  description:
    "Ideal simply supported single-span uniform-load momentwL\u00b2/8comparison with independently engineered allowable moment. Not bracket capacity, deflection, fasteners, multi-span shelf rating or structural approval.",
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
