import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualBetweenEndPostCenterDistance: number;
  readonly actualEqualPostBayCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualBetweenEndPostCenterDistance",
    label: "Actual between end post center distance",
    kind: "number",
  },
  {
    id: "actualEqualPostBayCount",
    label: "Actual equal post bay count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualBetweenEndPostCenterDistance,
    "actualBetweenEndPostCenterDistance",
  );
  bounded(input.actualEqualPostBayCount, "actualEqualPostBayCount", 1, 1000000);
  return {
    value:
      input.actualBetweenEndPostCenterDistance / input.actualEqualPostBayCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualBetweenEndPostCenterDistance: 10, actualEqualPostBayCount: 5 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/site-fence-post-spacing",
  title: "Fence Post Spacing Calculator",
  description:
    "Actual end post center-to-center distance/independent equal bay count, no picket clear gap or structural fence-design criterion. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
