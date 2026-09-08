import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly observedHoist: number;
  readonly observedFly: number;
  readonly referenceHoistUnits: number;
  readonly referenceFlyUnits: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedHoist", label: "Observed hoist", kind: "number" },
  { id: "observedFly", label: "Observed fly", kind: "number" },
  { id: "referenceHoistUnits", label: "Reference hoist units", kind: "number" },
  { id: "referenceFlyUnits", label: "Reference fly units", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.observedHoist, "observedHoist");
  positive(input.observedFly, "observedFly");
  positive(input.referenceHoistUnits, "referenceHoistUnits");
  positive(input.referenceFlyUnits, "referenceFlyUnits");
  return {
    observedHoistToFly: input.observedHoist / input.observedFly,
    signedRatioDifference:
      input.observedHoist / input.observedFly -
      input.referenceHoistUnits / input.referenceFlyUnits,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedHoist: 100,
    observedFly: 150,
    referenceHoistUnits: 2,
    referenceFlyUnits: 3,
  },
  output: {
    result: {
      observedHoistToFly: 0.6666666666666666,
      signedRatioDifference: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/aspect-ratio-checker",
  title: "Flag Aspect Ratio Checker",
  description:
    "Actual flag hoist:fly ratio against explicitly verified reference, not merely generic aspect formatting.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
