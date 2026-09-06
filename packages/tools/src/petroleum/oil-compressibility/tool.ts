import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, secants } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedSinglePhaseOilPressuresPa: readonly number[];
  readonly observedMatchedOilParcelVolumesM3: readonly number[];
  readonly callerSinglePhaseAboveBubblePointVerified: boolean;
}>;
export type Output = Readonly<{
  readonly observedLogSecantOilCompressibilitiesPerPa: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSinglePhaseOilPressuresPa",
    label: "Observed single phase oil pressures pa",
    kind: "numberList",
  },
  {
    id: "observedMatchedOilParcelVolumesM3",
    label: "Observed matched oil parcel volumes m3",
    kind: "numberList",
  },
  {
    id: "callerSinglePhaseAboveBubblePointVerified",
    label: "Caller single phase above bubble point verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSinglePhaseOilPressuresPa.forEach((v) =>
    positive(v, "observedSinglePhaseOilPressuresPa"),
  );
  input.observedMatchedOilParcelVolumesM3.forEach((v) =>
    positive(v, "observedMatchedOilParcelVolumesM3"),
  );
  if (!input.callerSinglePhaseAboveBubblePointVerified)
    simpleError(
      "phase",
      "Independent same-parcel single-phase oil above bubble point evidence required.",
    );
  return {
    observedLogSecantOilCompressibilitiesPerPa: secants(
      input.observedSinglePhaseOilPressuresPa,
      input.observedMatchedOilParcelVolumesM3.map(Math.log),
    ).map((v) => -v),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSinglePhaseOilPressuresPa: [1, 2, 3],
  observedMatchedOilParcelVolumesM3: [4, 2, 1],
  callerSinglePhaseAboveBubblePointVerified: true,
} satisfies Input;
export const exampleOutput = {
  observedLogSecantOilCompressibilitiesPerPa: [
    0.6931471805599453, 0.6931471805599453,
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/oil-compressibility",
  title: "Petroleum Oil Compressibility Calculator",
  description:
    "Extract actual logarithmic volume/pressure secant compressibility on independently verified single-phase oil branch, signed apparent expansion retained; not generic bulk modulus constant. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedLogSecantOilCompressibilitiesPerPa",
      label: "Observed log secant oil compressibilities per pa",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSinglePhaseOilPressuresPa:
        value.observedSinglePhaseOilPressuresPa as readonly number[],
      observedMatchedOilParcelVolumesM3:
        value.observedMatchedOilParcelVolumesM3 as readonly number[],
      callerSinglePhaseAboveBubblePointVerified:
        value.callerSinglePhaseAboveBubblePointVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
