import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count } from "../shared.js";
export type Input = Readonly<{
  readonly failedTrials: number;
  readonly totalTrials: number;
  readonly independentReleaseSites: number;
}>;
export type Output = Readonly<{
  readonly failureFraction: number;
  readonly perSiteReleaseProbability: number;
}>;
const inputFields = [
  { id: "failedTrials", label: "Failed trials", kind: "integer" },
  { id: "totalTrials", label: "Total trials", kind: "integer" },
  {
    id: "independentReleaseSites",
    label: "Independent release sites",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.failedTrials, "failedTrials");
  count(input.totalTrials, "totalTrials", 1);
  count(input.independentReleaseSites, "independentReleaseSites", 1);
  if (input.failedTrials > input.totalTrials)
    simpleError("failedTrials", "Failures cannot exceed trial count.");
  const failureFraction = input.failedTrials / input.totalTrials;
  return {
    failureFraction,
    perSiteReleaseProbability:
      failureFraction === 0
        ? 1
        : -Math.expm1(
            Math.log(failureFraction) / input.independentReleaseSites,
          ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  failedTrials: 25,
  totalTrials: 100,
  independentReleaseSites: 2,
} satisfies Input;
export const exampleOutput = {
  failureFraction: 0.25,
  perSiteReleaseProbability: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/release-probability-from-failures",
  title: "Release Probability",
  description:
    "Invert observed failure fraction F=(1−p)^N using supplied identical independent release sites; the boundary estimate p=1 does not imply certainty about underlying p.",
  inputs: inputFields,
  outputs: [
    { id: "failureFraction", label: "Failure fraction", kind: "number" },
    {
      id: "perSiteReleaseProbability",
      label: "Per site release probability",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      failedTrials: value.failedTrials as number,
      totalTrials: value.totalTrials as number,
      independentReleaseSites: value.independentReleaseSites as number,
    }),
});
export const run = tool.execute;
export default tool;
