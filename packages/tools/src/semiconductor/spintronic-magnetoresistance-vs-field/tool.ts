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
  bounded,
  aligned,
  strictlyIncreasing,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedSpintronicFieldsTesla: readonly number[];
  readonly observedMatchedResistanceOhms: readonly number[];
  readonly callerZeroFieldReferenceIndex: number;
}>;
export type Output = Readonly<{
  readonly observedSignedMagnetoresistanceFractions: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSpintronicFieldsTesla",
    label: "Observed spintronic fields tesla",
    kind: "numberList",
  },
  {
    id: "observedMatchedResistanceOhms",
    label: "Observed matched resistance ohms",
    kind: "numberList",
  },
  {
    id: "callerZeroFieldReferenceIndex",
    label: "Caller zero field reference index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedResistanceOhms.forEach((v) =>
    positive(v, "observedMatchedResistanceOhms"),
  );
  aligned(
    input.observedSpintronicFieldsTesla,
    input.observedMatchedResistanceOhms,
    "fieldTrace",
  );
  strictlyIncreasing(input.observedSpintronicFieldsTesla, "field");
  bounded(
    input.callerZeroFieldReferenceIndex,
    "reference",
    0,
    input.observedSpintronicFieldsTesla.length - 1,
  );
  if (
    input.observedSpintronicFieldsTesla[input.callerZeroFieldReferenceIndex] !==
    0
  )
    simpleError("reference", "Actual zero-field reference required.");
  const r =
    input.observedMatchedResistanceOhms[input.callerZeroFieldReferenceIndex];
  return {
    observedSignedMagnetoresistanceFractions:
      input.observedMatchedResistanceOhms.map((v) => v / r - 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSpintronicFieldsTesla: [-1, 0, 1],
  observedMatchedResistanceOhms: [12, 10, 11],
  callerZeroFieldReferenceIndex: 1,
} satisfies Input;
export const exampleOutput = {
  observedSignedMagnetoresistanceFractions: [0.2, 0, 0.1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/spintronic-magnetoresistance-vs-field",
  title: "Semiconductor Spintronic Magnetoresistance Vs Field Calculator",
  description:
    "Audit complete actual field-resistance trace against measured zero-field reference, distinct from scalar parallel/antiparallel TMR or polarization estimate.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSignedMagnetoresistanceFractions",
      label: "Observed signed magnetoresistance fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSpintronicFieldsTesla:
        value.observedSpintronicFieldsTesla as readonly number[],
      observedMatchedResistanceOhms:
        value.observedMatchedResistanceOhms as readonly number[],
      callerZeroFieldReferenceIndex:
        value.callerZeroFieldReferenceIndex as number,
    }),
});
export const run = tool.execute;
export default tool;
