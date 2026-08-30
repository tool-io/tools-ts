import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, maximum } from "../shared.js";

export type Input = Readonly<{
  readonly dailyPrecipitationMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly rx1dayMm: number;
  readonly firstMaximumDayIndex: number;
  readonly tiedMaximumDayIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "dailyPrecipitationMm",
    label: "Daily precipitation mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.dailyPrecipitationMm.forEach((v) =>
    nonnegative(v, "dailyPrecipitationMm"),
  );
  const rx1dayMm = maximum(input.dailyPrecipitationMm),
    tiedMaximumDayIndices = input.dailyPrecipitationMm.flatMap((v, i) =>
      v === rx1dayMm ? [i] : [],
    );
  return {
    rx1dayMm,
    firstMaximumDayIndex: tiedMaximumDayIndices[0],
    tiedMaximumDayIndices,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyPrecipitationMm: [1, 5, 5, 2],
} satisfies Input;
export const exampleOutput = {
  rx1dayMm: 5,
  firstMaximumDayIndex: 1,
  tiedMaximumDayIndices: [1, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/rx1day-max",
  title: "Max 1-Day Precipitation RX1day Extractor",
  description:
    "Extract observed RX1day with all tied ordinal indices and first maximum, without inventing a date for an incomplete series.",
  inputs: inputFields,
  outputs: [
    { id: "rx1dayMm", label: "Rx1day mm", kind: "number" },
    {
      id: "firstMaximumDayIndex",
      label: "First maximum day index",
      kind: "number",
    },
    {
      id: "tiedMaximumDayIndices",
      label: "Tied maximum day indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyPrecipitationMm: value.dailyPrecipitationMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
