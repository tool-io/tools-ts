import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly openingWidthM: number;
  readonly openingHeightM: number;
  readonly callerDesignAspectRatio: number;
  readonly callerAspectTolerance: number;
}>;
export type Output = Readonly<{
  readonly observedOpeningAspectRatio: number;
  readonly signedAspectDeviation: number;
  readonly withinCallerAspectPolicy: boolean;
}>;
const inputFields = [
  { id: "openingWidthM", label: "Opening width m", kind: "number" },
  { id: "openingHeightM", label: "Opening height m", kind: "number" },
  {
    id: "callerDesignAspectRatio",
    label: "Caller design aspect ratio",
    kind: "number",
  },
  {
    id: "callerAspectTolerance",
    label: "Caller aspect tolerance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.openingWidthM, "openingWidthM");
  positive(input.openingHeightM, "openingHeightM");
  positive(input.callerDesignAspectRatio, "callerDesignAspectRatio");
  nonnegative(input.callerAspectTolerance, "callerAspectTolerance");
  const r = input.openingWidthM / input.openingHeightM;
  return {
    observedOpeningAspectRatio: r,
    signedAspectDeviation: r - input.callerDesignAspectRatio,
    withinCallerAspectPolicy:
      Math.abs(r - input.callerDesignAspectRatio) <=
      input.callerAspectTolerance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  openingWidthM: 8,
  openingHeightM: 4,
  callerDesignAspectRatio: 2,
  callerAspectTolerance: 0.1,
} satisfies Input;
export const exampleOutput = {
  observedOpeningAspectRatio: 2,
  signedAspectDeviation: 0,
  withinCallerAspectPolicy: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/proscenium-opening-ratio-lookup",
  title: "Proscenium Opening Ratio Lookup",
  description:
    "Audit measured proscenium proportions against caller design brief, not a universal preferred opening or architectural safety criterion.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedOpeningAspectRatio",
      label: "Observed opening aspect ratio",
      kind: "number",
    },
    {
      id: "signedAspectDeviation",
      label: "Signed aspect deviation",
      kind: "number",
    },
    {
      id: "withinCallerAspectPolicy",
      label: "Within caller aspect policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      openingWidthM: value.openingWidthM as number,
      openingHeightM: value.openingHeightM as number,
      callerDesignAspectRatio: value.callerDesignAspectRatio as number,
      callerAspectTolerance: value.callerAspectTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
