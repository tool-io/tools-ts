import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerRodClosingScreenMicrons: number;
  readonly observedRodGramsPerRevolution: number;
  readonly observedRodFeedP80Microns: number;
  readonly observedRodProductP80Microns: number;
  readonly callerProtocolConstant: number;
}>;
export type Output = Readonly<{ readonly protocolRodMillWorkIndex: number }>;
const inputFields = [
  {
    id: "callerRodClosingScreenMicrons",
    label: "Caller rod closing screen microns",
    kind: "number",
  },
  {
    id: "observedRodGramsPerRevolution",
    label: "Observed rod grams per revolution",
    kind: "number",
  },
  {
    id: "observedRodFeedP80Microns",
    label: "Observed rod feed p80 microns",
    kind: "number",
  },
  {
    id: "observedRodProductP80Microns",
    label: "Observed rod product p80 microns",
    kind: "number",
  },
  {
    id: "callerProtocolConstant",
    label: "Caller protocol constant",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerRodClosingScreenMicrons,
    "callerRodClosingScreenMicrons",
  );
  positive(
    input.observedRodGramsPerRevolution,
    "observedRodGramsPerRevolution",
  );
  positive(input.observedRodFeedP80Microns, "observedRodFeedP80Microns");
  positive(input.observedRodProductP80Microns, "observedRodProductP80Microns");
  positive(input.callerProtocolConstant, "callerProtocolConstant");
  if (input.observedRodProductP80Microns >= input.observedRodFeedP80Microns)
    simpleError("size", "Rod test product P80<feed P80.");
  return {
    protocolRodMillWorkIndex:
      input.callerProtocolConstant /
      (input.callerRodClosingScreenMicrons ** 0.23 *
        input.observedRodGramsPerRevolution ** 0.625 *
        (10 / Math.sqrt(input.observedRodProductP80Microns) -
          10 / Math.sqrt(input.observedRodFeedP80Microns))),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRodClosingScreenMicrons: 100,
  observedRodGramsPerRevolution: 2,
  observedRodFeedP80Microns: 1000,
  observedRodProductP80Microns: 100,
  callerProtocolConstant: 62,
} satisfies Input;
export const exampleOutput = {
  protocolRodMillWorkIndex: 20.38620940072256,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/bond-rod-mill-work-index",
  title: "Bond Rod Mill Work Index Calculator",
  description:
    "Named rod-mill Bond test correlation with screen exponent.23 and grams/rev exponent.625, explicit protocol/tonne constant, unlike ball-mill .82 test or operating energy inverse. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "protocolRodMillWorkIndex",
      label: "Protocol rod mill work index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRodClosingScreenMicrons:
        value.callerRodClosingScreenMicrons as number,
      observedRodGramsPerRevolution:
        value.observedRodGramsPerRevolution as number,
      observedRodFeedP80Microns: value.observedRodFeedP80Microns as number,
      observedRodProductP80Microns:
        value.observedRodProductP80Microns as number,
      callerProtocolConstant: value.callerProtocolConstant as number,
    }),
});
export const run = tool.execute;
export default tool;
