import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly observedErmineSpotCount: number;
  readonly inspectedFieldArea: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedErmineSpotCount",
    label: "Observed ermine spot count",
    kind: "number",
  },
  { id: "inspectedFieldArea", label: "Inspected field area", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.inspectedFieldArea, "inspectedFieldArea");
  nonnegative(input.observedErmineSpotCount, "observedErmineSpotCount");
  integer(input.observedErmineSpotCount, "spots");
  return {
    spotDensity: input.observedErmineSpotCount / input.inspectedFieldArea,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedErmineSpotCount: 12, inspectedFieldArea: 60 },
  output: { result: { spotDensity: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/ermine-spot-density",
  title: "Ermine Spot Pattern Density Calculator",
  description:
    "Observed ermine-spot density per declared inspected area, not an inferred heraldic authenticity criterion.",
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
