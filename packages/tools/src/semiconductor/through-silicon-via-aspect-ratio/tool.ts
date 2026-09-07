import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedTsvDepthsMicron: readonly number[];
  readonly observedTsvMinimumDiametersMicron: readonly number[];
  readonly callerVerifiedMaximumAspectRatio: number;
}>;
export type Output = Readonly<{
  readonly observedTsvDepthDiameterRatios: readonly number[];
  readonly viasAboveCallerAspectRatio: readonly number[];
}>;
const inputFields = [
  {
    id: "observedTsvDepthsMicron",
    label: "Observed tsv depths micron",
    kind: "numberList",
  },
  {
    id: "observedTsvMinimumDiametersMicron",
    label: "Observed tsv minimum diameters micron",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMaximumAspectRatio",
    label: "Caller verified maximum aspect ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTsvDepthsMicron.forEach((v) =>
    positive(v, "observedTsvDepthsMicron"),
  );
  input.observedTsvMinimumDiametersMicron.forEach((v) =>
    positive(v, "observedTsvMinimumDiametersMicron"),
  );
  positive(
    input.callerVerifiedMaximumAspectRatio,
    "callerVerifiedMaximumAspectRatio",
  );
  aligned(
    input.observedTsvDepthsMicron,
    input.observedTsvMinimumDiametersMicron,
    "observedTsvDepthsMicron",
  );
  const ratios = input.observedTsvDepthsMicron.map(
    (v, i) => v / input.observedTsvMinimumDiametersMicron[i],
  );
  return {
    observedTsvDepthDiameterRatios: ratios,
    viasAboveCallerAspectRatio: ratios.flatMap((v, i) =>
      v > input.callerVerifiedMaximumAspectRatio ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTsvDepthsMicron: [10, 20],
  observedTsvMinimumDiametersMicron: [2, 4],
  callerVerifiedMaximumAspectRatio: 6,
} satisfies Input;
export const exampleOutput = {
  observedTsvDepthDiameterRatios: [5, 5],
  viasAboveCallerAspectRatio: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/through-silicon-via-aspect-ratio",
  title: "Semiconductor Through Silicon Via Aspect Ratio Calculator",
  description:
    "Audit measured TSV depth/minimum diameter inventory against verified aspect-ratio criterion; not electrical cylinder resistance, etched fill suitability or manufacturing process settings.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedTsvDepthDiameterRatios",
      label: "Observed tsv depth diameter ratios",
      kind: "numberList",
    },
    {
      id: "viasAboveCallerAspectRatio",
      label: "Vias above caller aspect ratio",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTsvDepthsMicron:
        value.observedTsvDepthsMicron as readonly number[],
      observedTsvMinimumDiametersMicron:
        value.observedTsvMinimumDiametersMicron as readonly number[],
      callerVerifiedMaximumAspectRatio:
        value.callerVerifiedMaximumAspectRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
