import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly changedProperty: string;
  readonly independentlyPromotedLayer: boolean;
  readonly independentlyNoRasterInvalidation: boolean;
}>;
export type Output = Readonly<{
  readonly compositorOnlyPrerequisitesWitnessed: boolean;
}>;
const inputFields = [
  { id: "changedProperty", label: "Changed property", kind: "string" },
  {
    id: "independentlyPromotedLayer",
    label: "Independently promoted layer",
    kind: "boolean",
  },
  {
    id: "independentlyNoRasterInvalidation",
    label: "Independently no raster invalidation",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  pick(input.changedProperty, { transform: 0, opacity: 1 }, "property");
  return {
    compositorOnlyPrerequisitesWitnessed:
      input.independentlyPromotedLayer &&
      input.independentlyNoRasterInvalidation,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  changedProperty: "transform",
  independentlyPromotedLayer: true,
  independentlyNoRasterInvalidation: true,
} satisfies Input;
export const exampleOutput = {
  compositorOnlyPrerequisitesWitnessed: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/compositor-only-transform-opacity-list",
  title: "Compositor-Only transform/opacity List",
  description:
    "Explicit trace-confirmed prerequisites for transform/opacity compositor-only updates; property name alone is not performance/compositing guarantee. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "compositorOnlyPrerequisitesWitnessed",
      label: "Compositor only prerequisites witnessed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      changedProperty: value.changedProperty as string,
      independentlyPromotedLayer: value.independentlyPromotedLayer as boolean,
      independentlyNoRasterInvalidation:
        value.independentlyNoRasterInvalidation as boolean,
    }),
});
export const run = tool.execute;
export default tool;
