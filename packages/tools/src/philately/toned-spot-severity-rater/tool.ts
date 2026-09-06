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
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly tonedAreaMm2: number;
  readonly stampAreaMm2: number;
}>;
export type Output = Readonly<{ readonly tonedAreaPercent: number }>;
const inputFields = [
  { id: "tonedAreaMm2", label: "Toned area mm2", kind: "number" },
  { id: "stampAreaMm2", label: "Stamp area mm2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.stampAreaMm2, "stampAreaMm2");
  nonnegative(input.tonedAreaMm2, "tonedAreaMm2");
  if (input.tonedAreaMm2 > input.stampAreaMm2)
    simpleError("area", "Toned area cannot exceed observed stamp area.");
  return { tonedAreaPercent: (100 * input.tonedAreaMm2) / input.stampAreaMm2 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  tonedAreaMm2: 3,
  stampAreaMm2: 60,
} satisfies Input;
export const exampleOutput = { tonedAreaPercent: 5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/toned-spot-severity-rater",
  title: "Toned Spot Severity Area Percent Rater",
  description:
    "Normalize measured toned spot area; no photographic segmentation or universal severity band. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "tonedAreaPercent", label: "Toned area percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      tonedAreaMm2: value.tonedAreaMm2 as number,
      stampAreaMm2: value.stampAreaMm2 as number,
    }),
});
export const run = tool.execute;
export default tool;
