import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly bandLowerElevationsM: readonly number[];
  readonly bandUpperElevationsM: readonly number[];
  readonly bandAreasM2: readonly number[];
  readonly equilibriumLineElevationM: number;
}>;
export type Output = Readonly<{
  readonly accumulationAreaM2: number;
  readonly totalGlacierAreaM2: number;
  readonly accumulationAreaRatio: number;
}>;
const inputFields = [
  {
    id: "bandLowerElevationsM",
    label: "Band lower elevations m",
    kind: "numberList",
  },
  {
    id: "bandUpperElevationsM",
    label: "Band upper elevations m",
    kind: "numberList",
  },
  { id: "bandAreasM2", label: "Band areas m2", kind: "numberList" },
  {
    id: "equilibriumLineElevationM",
    label: "Equilibrium line elevation m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.bandAreasM2.forEach((v) => positive(v, "bandAreasM2"));
  aligned(input.bandAreasM2, input.bandLowerElevationsM, "bandAreasM2");
  aligned(input.bandAreasM2, input.bandUpperElevationsM, "bandAreasM2");
  const accumulationAreaM2 = input.bandAreasM2.reduce((s, v, i) => {
      const lo = input.bandLowerElevationsM[i],
        hi = input.bandUpperElevationsM[i];
      if (hi <= lo || (i && lo < input.bandUpperElevationsM[i - 1]))
        simpleError(
          "bandLowerElevationsM",
          "Ordered nonoverlapping positive-height bands required.",
        );
      return (
        s +
        v *
          Math.max(
            0,
            Math.min(
              1,
              (hi - Math.max(lo, input.equilibriumLineElevationM)) / (hi - lo),
            ),
          )
      );
    }, 0),
    totalGlacierAreaM2 = input.bandAreasM2.reduce((a, b) => a + b, 0);
  return {
    accumulationAreaM2,
    totalGlacierAreaM2,
    accumulationAreaRatio: accumulationAreaM2 / totalGlacierAreaM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  bandLowerElevationsM: [100, 200],
  bandUpperElevationsM: [200, 300],
  bandAreasM2: [100, 200],
  equilibriumLineElevationM: 250,
} satisfies Input;
export const exampleOutput = {
  accumulationAreaM2: 100,
  totalGlacierAreaM2: 300,
  accumulationAreaRatio: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/accumulation-area-ratio-aar",
  title: "Accumulation Area Ratio AAR",
  description:
    "Estimate AAR above a supplied ELA with area uniform within each elevation band; nonuniform hypsometry and transient snowline differences are external.",
  inputs: inputFields,
  outputs: [
    { id: "accumulationAreaM2", label: "Accumulation area m2", kind: "number" },
    {
      id: "totalGlacierAreaM2",
      label: "Total glacier area m2",
      kind: "number",
    },
    {
      id: "accumulationAreaRatio",
      label: "Accumulation area ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      bandLowerElevationsM: value.bandLowerElevationsM as readonly number[],
      bandUpperElevationsM: value.bandUpperElevationsM as readonly number[],
      bandAreasM2: value.bandAreasM2 as readonly number[],
      equilibriumLineElevationM: value.equilibriumLineElevationM as number,
    }),
});
export const run = tool.execute;
export default tool;
