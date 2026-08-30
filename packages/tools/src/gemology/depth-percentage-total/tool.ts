import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly measuredTotalDepthMm: number;
  readonly componentDepthsCrownGirdlePavilionMm: readonly number[];
  readonly measuredGirdleDiameterMm: number;
}>;
export type Output = Readonly<{
  readonly totalDepthPercent: number;
  readonly componentDepthSumMm: number;
  readonly signedComponentClosureErrorMm: number;
}>;
const inputFields = [
  {
    id: "measuredTotalDepthMm",
    label: "Measured total depth mm",
    kind: "number",
  },
  {
    id: "componentDepthsCrownGirdlePavilionMm",
    label: "Component depths crown girdle pavilion mm",
    kind: "numberList",
  },
  {
    id: "measuredGirdleDiameterMm",
    label: "Measured girdle diameter mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measuredGirdleDiameterMm, "measuredGirdleDiameterMm");
  nonnegative(input.measuredTotalDepthMm, "measuredTotalDepthMm");
  input.componentDepthsCrownGirdlePavilionMm.forEach((v) =>
    nonnegative(v, "componentDepthsCrownGirdlePavilionMm"),
  );
  if (input.componentDepthsCrownGirdlePavilionMm.length !== 3)
    simpleError(
      "components",
      "Separate crown/girdle/pavilion depths required.",
    );
  const componentDepthSumMm = input.componentDepthsCrownGirdlePavilionMm.reduce(
    (a, b) => a + b,
    0,
  );
  return {
    totalDepthPercent:
      (100 * input.measuredTotalDepthMm) / input.measuredGirdleDiameterMm,
    componentDepthSumMm,
    signedComponentClosureErrorMm:
      input.measuredTotalDepthMm - componentDepthSumMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredTotalDepthMm: 6,
  componentDepthsCrownGirdlePavilionMm: [1, 2, 3],
  measuredGirdleDiameterMm: 10,
} satisfies Input;
export const exampleOutput = {
  totalDepthPercent: 60,
  componentDepthSumMm: 6,
  signedComponentClosureErrorMm: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/depth-percentage-total",
  title: "Total Depth Percentage",
  description:
    "Audit measured total depth against independently measured crown/girdle/pavilion depth ledger and girdle diameter; closure error remains signed, not another solitary component-percentage alias.",
  inputs: inputFields,
  outputs: [
    { id: "totalDepthPercent", label: "Total depth percent", kind: "number" },
    {
      id: "componentDepthSumMm",
      label: "Component depth sum mm",
      kind: "number",
    },
    {
      id: "signedComponentClosureErrorMm",
      label: "Signed component closure error mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredTotalDepthMm: value.measuredTotalDepthMm as number,
      componentDepthsCrownGirdlePavilionMm:
        value.componentDepthsCrownGirdlePavilionMm as readonly number[],
      measuredGirdleDiameterMm: value.measuredGirdleDiameterMm as number,
    }),
});
export const run = tool.execute;
export default tool;
