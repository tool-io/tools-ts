import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly postallyUsed: boolean;
  readonly gumPresent: boolean;
  readonly hingeTrace: boolean;
  readonly lightHingeTrace: boolean;
}>;
export type Output = Readonly<{ readonly descriptor: string }>;
const inputFields = [
  { id: "postallyUsed", label: "Postally used", kind: "boolean" },
  { id: "gumPresent", label: "Gum present", kind: "boolean" },
  { id: "hingeTrace", label: "Hinge trace", kind: "boolean" },
  { id: "lightHingeTrace", label: "Light hinge trace", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.lightHingeTrace && !input.hingeTrace)
    simpleError("hinge", "Light hinge implies hinge trace.");
  return {
    descriptor: input.postallyUsed
      ? "Used"
      : !input.gumPresent
        ? "Unused-no-gum"
        : !input.hingeTrace
          ? "MNH"
          : input.lightHingeTrace
            ? "MLH"
            : "MH",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  postallyUsed: false,
  gumPresent: true,
  hingeTrace: true,
  lightHingeTrace: false,
} satisfies Input;
export const exampleOutput = { descriptor: "MH" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/gum-condition-descriptor-selector",
  title: "Gum Condition Descriptor Selector (MNH/MH/MLH/Used)",
  description:
    "Select a descriptive caller-observed use/gum/hinge label; original gum cannot be established from these flags. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [{ id: "descriptor", label: "Descriptor", kind: "string" }],
  calculate: (value) =>
    calculate({
      postallyUsed: value.postallyUsed as boolean,
      gumPresent: value.gumPresent as boolean,
      hingeTrace: value.hingeTrace as boolean,
      lightHingeTrace: value.lightHingeTrace as boolean,
    }),
});
export const run = tool.execute;
export default tool;
