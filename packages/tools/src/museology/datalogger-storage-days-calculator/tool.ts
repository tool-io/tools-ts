import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly usableLoggerBytes: number;
  readonly headerBytes: number;
  readonly bytesPerSample: number;
  readonly sampleIntervalSeconds: number;
}>;
export type Output = Readonly<{
  readonly maximumCompleteStoredSamples: number;
  readonly firstToLastStoredSampleSpanDays: number;
}>;
const inputFields = [
  { id: "usableLoggerBytes", label: "Usable logger bytes", kind: "integer" },
  { id: "headerBytes", label: "Header bytes", kind: "integer" },
  { id: "bytesPerSample", label: "Bytes per sample", kind: "integer" },
  {
    id: "sampleIntervalSeconds",
    label: "Sample interval seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.bytesPerSample, "bytesPerSample");
  positive(input.sampleIntervalSeconds, "sampleIntervalSeconds");
  count(input.usableLoggerBytes, "usableLoggerBytes");
  count(input.headerBytes, "headerBytes");
  count(input.bytesPerSample, "bytesPerSample");
  const n = count(
    Math.floor(
      nonnegative(input.usableLoggerBytes - input.headerBytes, "header") /
        input.bytesPerSample,
    ),
    "samples",
  );
  return {
    maximumCompleteStoredSamples: n,
    firstToLastStoredSampleSpanDays:
      (Math.max(0, n - 1) * input.sampleIntervalSeconds) / 86400,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  usableLoggerBytes: 1000,
  headerBytes: 100,
  bytesPerSample: 10,
  sampleIntervalSeconds: 60,
} satisfies Input;
export const exampleOutput = {
  maximumCompleteStoredSamples: 90,
  firstToLastStoredSampleSpanDays: 0.06180555555555556,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/datalogger-storage-days-calculator",
  title: "Data Logger Sample Rate Storage Days Calculator",
  description:
    "Budget complete logger records after header overhead and distinguish N samples from N−1 observed elapsed intervals; no filesystem wear, compression or indefinite data retention assumption.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumCompleteStoredSamples",
      label: "Maximum complete stored samples",
      kind: "number",
    },
    {
      id: "firstToLastStoredSampleSpanDays",
      label: "First to last stored sample span days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      usableLoggerBytes: value.usableLoggerBytes as number,
      headerBytes: value.headerBytes as number,
      bytesPerSample: value.bytesPerSample as number,
      sampleIntervalSeconds: value.sampleIntervalSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
