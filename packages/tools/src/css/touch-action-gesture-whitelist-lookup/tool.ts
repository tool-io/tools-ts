import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly touchAction: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "touchAction", label: "Touch action", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.touchAction,
      {
        auto: "UA permitted to handle supported direct-manipulation gestures",
        none: "no UA direct-manipulation panning or zooming for this value",
        "pan-x": "permits horizontal panning",
        "pan-y": "permits vertical panning",
        "pinch-zoom": "permits pinch zoom",
        manipulation:
          "permits panning and pinch zoom; disables additional gestures such as double-tap zoom",
      },
      "touchAction",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { touchAction: "manipulation" } satisfies Input;
export const exampleOutput = {
  meaning:
    "permits panning and pinch zoom; disables additional gestures such as double-tap zoom",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/touch-action-gesture-whitelist-lookup",
  title: "touch-action Gesture Whitelist Lookup",
  description:
    "Supported single-value touch-action permission semantics; actual gesture result intersects ancestor values at gesture start. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ touchAction: value.touchAction as string }),
});
export const run = tool.execute;
export default tool;
