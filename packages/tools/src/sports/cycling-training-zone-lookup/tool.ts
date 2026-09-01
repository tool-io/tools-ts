import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  unique,
  band,
  ordered,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerZoneIds: readonly string[];
  readonly callerMinimumFtpFractions: readonly number[];
  readonly callerMaximumFtpFractions: readonly number[];
  readonly independentlyMeasuredFtpWatts: number;
  readonly observedWatts: number;
}>;
export type Output = Readonly<{
  readonly callerZoneRangesWatts: readonly (readonly number[])[];
  readonly compatibleCallerZoneIds: readonly string[];
}>;
const inputFields = [
  { id: "callerZoneIds", label: "Caller zone ids", kind: "stringList" },
  {
    id: "callerMinimumFtpFractions",
    label: "Caller minimum ftp fractions",
    kind: "numberList",
  },
  {
    id: "callerMaximumFtpFractions",
    label: "Caller maximum ftp fractions",
    kind: "numberList",
  },
  {
    id: "independentlyMeasuredFtpWatts",
    label: "Independently measured ftp watts",
    kind: "number",
  },
  { id: "observedWatts", label: "Observed watts", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentlyMeasuredFtpWatts,
    "independentlyMeasuredFtpWatts",
  );
  input.callerMinimumFtpFractions.forEach((v) =>
    nonnegative(v, "callerMinimumFtpFractions"),
  );
  input.callerMaximumFtpFractions.forEach((v) =>
    nonnegative(v, "callerMaximumFtpFractions"),
  );
  nonnegative(input.observedWatts, "observedWatts");
  aligned(
    input.callerZoneIds,
    input.callerMinimumFtpFractions,
    "callerZoneIds",
  );
  aligned(
    input.callerZoneIds,
    input.callerMaximumFtpFractions,
    "callerZoneIds",
  );
  unique(input.callerZoneIds, "zones");
  const ranges = input.callerMinimumFtpFractions.map((v, i) => {
    ordered(v, input.callerMaximumFtpFractions[i]);
    return [
      v * input.independentlyMeasuredFtpWatts,
      input.callerMaximumFtpFractions[i] * input.independentlyMeasuredFtpWatts,
    ];
  });
  return {
    callerZoneRangesWatts: ranges,
    compatibleCallerZoneIds: input.callerZoneIds.filter(
      (_, i) => band(input.observedWatts, ranges[i][0], ranges[i][1]) >= 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerZoneIds: ["a", "b"],
  callerMinimumFtpFractions: [0, 0.8],
  callerMaximumFtpFractions: [0.7, 1],
  independentlyMeasuredFtpWatts: 200,
  observedWatts: 150,
} satisfies Input;
export const exampleOutput = {
  callerZoneRangesWatts: [
    [0, 140],
    [160, 200],
  ],
  compatibleCallerZoneIds: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/cycling-training-zone-lookup",
  title: "Cycling Training Zone Lookup",
  description:
    "Read actual caller cycling zone intervals and measured FTP/power, retaining overlapping/no matches; no inferred Coggan edition, medical intensity prescription or HRR alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerZoneRangesWatts",
      label: "Caller zone ranges watts",
      kind: "matrix",
    },
    {
      id: "compatibleCallerZoneIds",
      label: "Compatible caller zone ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerZoneIds: value.callerZoneIds as readonly string[],
      callerMinimumFtpFractions:
        value.callerMinimumFtpFractions as readonly number[],
      callerMaximumFtpFractions:
        value.callerMaximumFtpFractions as readonly number[],
      independentlyMeasuredFtpWatts:
        value.independentlyMeasuredFtpWatts as number,
      observedWatts: value.observedWatts as number,
    }),
});
export const run = tool.execute;
export default tool;
