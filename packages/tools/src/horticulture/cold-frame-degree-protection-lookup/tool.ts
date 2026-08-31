import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly matchedOutsideMinimumTemperaturesC: readonly number[];
  readonly matchedColdFrameMinimumTemperaturesC: readonly number[];
  readonly callerRequiredProtectionDegreesC: number;
}>;
export type Output = Readonly<{
  readonly observedPairedProtectionDegreesC: readonly number[];
  readonly minimumObservedMatchedProtectionDegreesC: number;
  readonly allObservedPairsMeetCallerProtection: boolean;
}>;
const inputFields = [
  {
    id: "matchedOutsideMinimumTemperaturesC",
    label: "Matched outside minimum temperatures c",
    kind: "numberList",
  },
  {
    id: "matchedColdFrameMinimumTemperaturesC",
    label: "Matched cold frame minimum temperatures c",
    kind: "numberList",
  },
  {
    id: "callerRequiredProtectionDegreesC",
    label: "Caller required protection degrees c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerRequiredProtectionDegreesC,
    "callerRequiredProtectionDegreesC",
  );
  aligned(
    input.matchedOutsideMinimumTemperaturesC,
    input.matchedColdFrameMinimumTemperaturesC,
    "matchedOutsideMinimumTemperaturesC",
  );
  const d = input.matchedColdFrameMinimumTemperaturesC.map(
    (v, i) => v - input.matchedOutsideMinimumTemperaturesC[i],
  );
  return {
    observedPairedProtectionDegreesC: d,
    minimumObservedMatchedProtectionDegreesC: Math.min(...d),
    allObservedPairsMeetCallerProtection: d.every(
      (v) => v >= input.callerRequiredProtectionDegreesC,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  matchedOutsideMinimumTemperaturesC: [-5, -2],
  matchedColdFrameMinimumTemperaturesC: [-2, 0],
  callerRequiredProtectionDegreesC: 3,
} satisfies Input;
export const exampleOutput = {
  observedPairedProtectionDegreesC: [3, 2],
  minimumObservedMatchedProtectionDegreesC: 2,
  allObservedPairsMeetCallerProtection: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/cold-frame-degree-protection-lookup",
  title: "Cold Frame Degree Protection Lookup",
  description:
    "Audit actual paired outside/cold-frame minimum observations rather than inventing universal degree protection; exposure pairs independently matched, not weather forecast or crop frost survival assurance.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPairedProtectionDegreesC",
      label: "Observed paired protection degrees c",
      kind: "numberList",
    },
    {
      id: "minimumObservedMatchedProtectionDegreesC",
      label: "Minimum observed matched protection degrees c",
      kind: "number",
    },
    {
      id: "allObservedPairsMeetCallerProtection",
      label: "All observed pairs meet caller protection",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      matchedOutsideMinimumTemperaturesC:
        value.matchedOutsideMinimumTemperaturesC as readonly number[],
      matchedColdFrameMinimumTemperaturesC:
        value.matchedColdFrameMinimumTemperaturesC as readonly number[],
      callerRequiredProtectionDegreesC:
        value.callerRequiredProtectionDegreesC as number,
    }),
});
export const run = tool.execute;
export default tool;
