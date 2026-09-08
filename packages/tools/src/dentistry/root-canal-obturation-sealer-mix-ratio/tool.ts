import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredSealerComponentAQuantity: number;
  readonly actualMeasuredSealerComponentBQuantity: number;
  readonly callerManufacturerSpecifiedAtoBRatio: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredSealerComponentAQuantity",
    label: "Actual measured sealer component a quantity",
    kind: "number",
  },
  {
    id: "actualMeasuredSealerComponentBQuantity",
    label: "Actual measured sealer component b quantity",
    kind: "number",
  },
  {
    id: "callerManufacturerSpecifiedAtoBRatio",
    label: "Caller manufacturer specified ato b ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualMeasuredSealerComponentAQuantity, "A");
  positive(input.actualMeasuredSealerComponentBQuantity, "B");
  positive(input.callerManufacturerSpecifiedAtoBRatio, "specified");
  const r =
    input.actualMeasuredSealerComponentAQuantity /
    input.actualMeasuredSealerComponentBQuantity;
  return {
    observedAtoBRatio: r,
    signedObservedMinusSpecifiedRatio:
      r - input.callerManufacturerSpecifiedAtoBRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredSealerComponentAQuantity: 2,
    actualMeasuredSealerComponentBQuantity: 1,
    callerManufacturerSpecifiedAtoBRatio: 2,
  },
  output: {
    result: { observedAtoBRatio: 2, signedObservedMinusSpecifiedRatio: 0 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/root-canal-obturation-sealer-mix-ratio",
  title: "Sealer Mix Ratio Calculator",
  description:
    "Actual sealer component ratio versus independently verified manufacturer instructions on the same declared mass/volume basis. No universal ratio, mixing procedure, material efficacy or safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
