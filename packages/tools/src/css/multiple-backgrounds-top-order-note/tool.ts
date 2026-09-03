import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unique } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerBackgroundLayerIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly frontToBackLayerIds: readonly string[];
  readonly topmostLayerId: string;
}>;
const inputFields = [
  {
    id: "callerBackgroundLayerIds",
    label: "Caller background layer ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerBackgroundLayerIds, "layers");
  return {
    frontToBackLayerIds: [...input.callerBackgroundLayerIds],
    topmostLayerId: input.callerBackgroundLayerIds[0],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBackgroundLayerIds: ["front", "back"],
} satisfies Input;
export const exampleOutput = {
  frontToBackLayerIds: ["front", "back"],
  topmostLayerId: "front",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/multiple-backgrounds-top-order-note",
  title: "Multiple Backgrounds First-On-Top Order",
  description:
    "Multiple background image layer list is front-to-back, background color lies behind all images; inputs are already parsed declaration-order layers. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "frontToBackLayerIds",
      label: "Front to back layer ids",
      kind: "stringList",
    },
    { id: "topmostLayerId", label: "Topmost layer id", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      callerBackgroundLayerIds:
        value.callerBackgroundLayerIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
