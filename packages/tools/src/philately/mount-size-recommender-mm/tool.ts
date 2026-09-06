import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly stampWidthMm: number;
  readonly stampHeightMm: number;
  readonly clearanceEachSideMm: number;
}>;
export type Output = Readonly<{
  readonly minimumInternalWidthMm: number;
  readonly minimumInternalHeightMm: number;
}>;
const inputFields = [
  { id: "stampWidthMm", label: "Stamp width mm", kind: "number" },
  { id: "stampHeightMm", label: "Stamp height mm", kind: "number" },
  {
    id: "clearanceEachSideMm",
    label: "Clearance each side mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.stampWidthMm, "stampWidthMm");
  positive(input.stampHeightMm, "stampHeightMm");
  nonnegative(input.clearanceEachSideMm, "clearanceEachSideMm");
  return {
    minimumInternalWidthMm: input.stampWidthMm + 2 * input.clearanceEachSideMm,
    minimumInternalHeightMm:
      input.stampHeightMm + 2 * input.clearanceEachSideMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stampWidthMm: 20,
  stampHeightMm: 30,
  clearanceEachSideMm: 1,
} satisfies Input;
export const exampleOutput = {
  minimumInternalWidthMm: 22,
  minimumInternalHeightMm: 32,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/mount-size-recommender-mm",
  title: "Mount Size mm Height Width Recommender from Stamp Size",
  description:
    "Calculate internal mount clearance dimensions, not adhesive compatibility or a product recommendation. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumInternalWidthMm",
      label: "Minimum internal width mm",
      kind: "number",
    },
    {
      id: "minimumInternalHeightMm",
      label: "Minimum internal height mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stampWidthMm: value.stampWidthMm as number,
      stampHeightMm: value.stampHeightMm as number,
      clearanceEachSideMm: value.clearanceEachSideMm as number,
    }),
});
export const run = tool.execute;
export default tool;
