import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  unique,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedTestAverageWatts: readonly number[];
  readonly callerProtocolConversionFractions: readonly number[];
  readonly callerProtocolIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly callerProtocolEstimatedFtpWatts: readonly number[];
  readonly protocolEstimateSpreadWatts: number;
}>;
const inputFields = [
  {
    id: "observedTestAverageWatts",
    label: "Observed test average watts",
    kind: "numberList",
  },
  {
    id: "callerProtocolConversionFractions",
    label: "Caller protocol conversion fractions",
    kind: "numberList",
  },
  { id: "callerProtocolIds", label: "Caller protocol ids", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerProtocolConversionFractions.forEach((v) =>
    positive(v, "callerProtocolConversionFractions"),
  );
  input.observedTestAverageWatts.forEach((v) =>
    nonnegative(v, "observedTestAverageWatts"),
  );
  input.callerProtocolConversionFractions.forEach((v) =>
    fraction(v, "callerProtocolConversionFractions"),
  );
  aligned(
    input.observedTestAverageWatts,
    input.callerProtocolConversionFractions,
    "observedTestAverageWatts",
  );
  aligned(
    input.observedTestAverageWatts,
    input.callerProtocolIds,
    "observedTestAverageWatts",
  );
  unique(input.callerProtocolIds, "protocols");
  const ftp = input.observedTestAverageWatts.map(
    (v, i) => v * input.callerProtocolConversionFractions[i],
  );
  return {
    callerProtocolEstimatedFtpWatts: ftp,
    protocolEstimateSpreadWatts: Math.max(...ftp) - Math.min(...ftp),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTestAverageWatts: [200, 300],
  callerProtocolConversionFractions: [0.95, 0.75],
  callerProtocolIds: ["20-minute", "ramp"],
} satisfies Input;
export const exampleOutput = {
  callerProtocolEstimatedFtpWatts: [190, 225],
  protocolEstimateSpreadWatts: 35,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/ftp-functional-threshold-power-test",
  title: "FTP Test Calculator",
  description:
    "Compare actual caller-identified FTP test protocols with separately supplied conversion assumptions; no prescribed strenuous test or universal correction factor.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerProtocolEstimatedFtpWatts",
      label: "Caller protocol estimated ftp watts",
      kind: "numberList",
    },
    {
      id: "protocolEstimateSpreadWatts",
      label: "Protocol estimate spread watts",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTestAverageWatts:
        value.observedTestAverageWatts as readonly number[],
      callerProtocolConversionFractions:
        value.callerProtocolConversionFractions as readonly number[],
      callerProtocolIds: value.callerProtocolIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
