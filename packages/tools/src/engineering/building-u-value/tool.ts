import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  sum,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly insideFilmResistance: number;
  readonly outsideFilmResistance: number;
  readonly layerThermalResistances: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "insideFilmResistance",
    label: "Inside film resistance",
    kind: "number",
  },
  {
    id: "outsideFilmResistance",
    label: "Outside film resistance",
    kind: "number",
  },
  {
    id: "layerThermalResistances",
    label: "Layer thermal resistances",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.insideFilmResistance, "insideFilmResistance");
  nonnegative(input.outsideFilmResistance, "outsideFilmResistance");
  if (!input.layerThermalResistances.length)
    simpleError("layerThermalResistances", "Actual nonempty observations.");
  input.layerThermalResistances.forEach((v) =>
    positive(v, "layerThermalResistances"),
  );
  return {
    value:
      1 /
      (input.insideFilmResistance +
        input.outsideFilmResistance +
        sum(input.layerThermalResistances)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    insideFilmResistance: 0.2,
    outsideFilmResistance: 0.3,
    layerThermalResistances: [0.5],
  },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/building-u-value",
  title: "Building U-Value Calculator",
  description:
    "Plane multi layer Uvalue as inverse total areal thermal resistance, independently matched surface films/layers; thermal bridges/moisture external. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
