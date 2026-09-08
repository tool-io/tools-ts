import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedDevicePixelExtent: number;
  readonly observedMatchedCssPixelExtent: number;
}>;
export type Output = Readonly<{ readonly observedDevicePixelRatio: number }>;
const inputFields = [
  {
    id: "observedDevicePixelExtent",
    label: "Observed device pixel extent",
    kind: "number",
  },
  {
    id: "observedMatchedCssPixelExtent",
    label: "Observed matched css pixel extent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedDevicePixelExtent, "observedDevicePixelExtent");
  positive(
    input.observedMatchedCssPixelExtent,
    "observedMatchedCssPixelExtent",
  );
  return {
    observedDevicePixelRatio:
      input.observedDevicePixelExtent / input.observedMatchedCssPixelExtent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDevicePixelExtent: 200,
  observedMatchedCssPixelExtent: 100,
} satisfies Input;
export const exampleOutput = { observedDevicePixelRatio: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/device-pixel-ratio-css-px-lookup",
  title: "Device Pixel Ratio CSS px Lookup",
  description:
    "Matched actual CSS/device pixel extent ratio, not physical PPI or inferred fixed ratio for a devices name. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDevicePixelRatio",
      label: "Observed device pixel ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDevicePixelExtent: value.observedDevicePixelExtent as number,
      observedMatchedCssPixelExtent:
        value.observedMatchedCssPixelExtent as number,
    }),
});
export const run = tool.execute;
export default tool;
