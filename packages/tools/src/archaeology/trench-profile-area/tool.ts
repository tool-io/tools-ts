import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  integral,
} from "../shared.js";
export type Input = Readonly<{
  readonly profileStationDistancesM: readonly number[];
  readonly surfaceDepthsM: readonly number[];
  readonly excavationBaseDepthsM: readonly number[];
}>;
export type Output = Readonly<{ readonly excavatedProfileAreaM2: number }>;
const inputFields = [
  {
    id: "profileStationDistancesM",
    label: "Profile station distances m",
    kind: "numberList",
  },
  { id: "surfaceDepthsM", label: "Surface depths m", kind: "numberList" },
  {
    id: "excavationBaseDepthsM",
    label: "Excavation base depths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.surfaceDepthsM.forEach((v) => nonnegative(v, "surfaceDepthsM"));
  input.excavationBaseDepthsM.forEach((v) =>
    nonnegative(v, "excavationBaseDepthsM"),
  );
  aligned(
    input.profileStationDistancesM,
    input.surfaceDepthsM,
    "profileStationDistancesM",
  );
  aligned(
    input.profileStationDistancesM,
    input.excavationBaseDepthsM,
    "profileStationDistancesM",
  );
  const h = input.excavationBaseDepthsM.map((v, i) =>
    nonnegative(v - input.surfaceDepthsM[i], "excavationBaseDepthsM"),
  );
  return {
    excavatedProfileAreaM2: integral(input.profileStationDistancesM, h),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  profileStationDistancesM: [0, 1, 3],
  surfaceDepthsM: [0, 0.2, 0.1],
  excavationBaseDepthsM: [1, 1.2, 2.1],
} satisfies Input;
export const exampleOutput = { excavatedProfileAreaM2: 4 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/trench-profile-area",
  title: "Trench Profile Area",
  description:
    "Integrate vertical cut thickness between measured positive-down surface and base profiles on supplied station distances; no coordinate mapping or rectangular area assumption.",
  inputs: inputFields,
  outputs: [
    {
      id: "excavatedProfileAreaM2",
      label: "Excavated profile area m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      profileStationDistancesM:
        value.profileStationDistancesM as readonly number[],
      surfaceDepthsM: value.surfaceDepthsM as readonly number[],
      excavationBaseDepthsM: value.excavationBaseDepthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
