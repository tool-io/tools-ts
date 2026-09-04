import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly spanM: number;
  readonly loadStationsM: readonly number[];
  readonly sectionStationM: number;
}>;
export type Output = Readonly<{
  readonly leftReactionInfluence: readonly number[];
  readonly sectionMomentInfluenceM: readonly number[];
}>;
const inputFields = [
  { id: "spanM", label: "Span m", kind: "number" },
  { id: "loadStationsM", label: "Load stations m", kind: "numberList" },
  { id: "sectionStationM", label: "Section station m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.spanM, "spanM");
  input.loadStationsM.forEach((v) => nonnegative(v, "loadStationsM"));
  nonnegative(input.sectionStationM, "sectionStationM");
  if (
    input.sectionStationM > input.spanM ||
    input.loadStationsM.some((v) => v > input.spanM)
  )
    simpleError("stations", "Inside simply supported span.");
  return {
    leftReactionInfluence: input.loadStationsM.map((x) => 1 - x / input.spanM),
    sectionMomentInfluenceM: input.loadStationsM.map((x) =>
      x <= input.sectionStationM
        ? x * (1 - input.sectionStationM / input.spanM)
        : input.sectionStationM * (1 - x / input.spanM),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  spanM: 10,
  loadStationsM: [0, 2, 10],
  sectionStationM: 4,
} satisfies Input;
export const exampleOutput = {
  leftReactionInfluence: [1, 0.8, 0],
  sectionMomentInfluenceM: [0, 1.2, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/influence-line-ordinate",
  title: "Influence Line Ordinate Calculator",
  description:
    "Exact unit moving-load ordinates for simply supported beam reaction and a fixed section moment. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "leftReactionInfluence",
      label: "Left reaction influence",
      kind: "numberList",
    },
    {
      id: "sectionMomentInfluenceM",
      label: "Section moment influence m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      spanM: value.spanM as number,
      loadStationsM: value.loadStationsM as readonly number[],
      sectionStationM: value.sectionStationM as number,
    }),
});
export const run = tool.execute;
export default tool;
