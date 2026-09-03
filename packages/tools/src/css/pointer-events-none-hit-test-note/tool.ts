import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly elementPointerEvents: string;
  readonly independentlyFocusable: boolean;
  readonly descendantOverridesPointerEvents: boolean;
}>;
export type Output = Readonly<{
  readonly elementHitTestTarget: boolean;
  readonly keyboardFocusExcluded: boolean;
  readonly descendantMayBeTarget: boolean;
}>;
const inputFields = [
  {
    id: "elementPointerEvents",
    label: "Element pointer events",
    kind: "string",
  },
  {
    id: "independentlyFocusable",
    label: "Independently focusable",
    kind: "boolean",
  },
  {
    id: "descendantOverridesPointerEvents",
    label: "Descendant overrides pointer events",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  pick(input.elementPointerEvents, { none: 0, auto: 1 }, "pointer-events");
  return {
    elementHitTestTarget: input.elementPointerEvents === "auto",
    keyboardFocusExcluded: !input.independentlyFocusable,
    descendantMayBeTarget: input.descendantOverridesPointerEvents,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  elementPointerEvents: "none",
  independentlyFocusable: true,
  descendantOverridesPointerEvents: true,
} satisfies Input;
export const exampleOutput = {
  elementHitTestTarget: false,
  keyboardFocusExcluded: false,
  descendantMayBeTarget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/pointer-events-none-hit-test-note",
  title: "pointer-events:none Hit-Test Bypass Note",
  description:
    "HTML auto/none hit-test eligibility contrasted with independently established keyboard focus and descendant overrides; not disable bubbling or keyboard activation. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "elementHitTestTarget",
      label: "Element hit test target",
      kind: "boolean",
    },
    {
      id: "keyboardFocusExcluded",
      label: "Keyboard focus excluded",
      kind: "boolean",
    },
    {
      id: "descendantMayBeTarget",
      label: "Descendant may be target",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      elementPointerEvents: value.elementPointerEvents as string,
      independentlyFocusable: value.independentlyFocusable as boolean,
      descendantOverridesPointerEvents:
        value.descendantOverridesPointerEvents as boolean,
    }),
});
export const run = tool.execute;
export default tool;
