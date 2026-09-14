import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualAbsolutePhaseDensityDifference: number;
  readonly callerGravity: number;
  readonly actualCharacteristicLength: number;
  readonly actualInterfacialTension: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualAbsolutePhaseDensityDifference",
    label: "Actual absolute phase density difference",
    kind: "number",
  },
  { id: "callerGravity", label: "Caller gravity", kind: "number" },
  {
    id: "actualCharacteristicLength",
    label: "Actual characteristic length",
    kind: "number",
  },
  {
    id: "actualInterfacialTension",
    label: "Actual interfacial tension",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualAbsolutePhaseDensityDifference,
    "actualAbsolutePhaseDensityDifference",
  );
  positive(input.callerGravity, "callerGravity");
  positive(input.actualCharacteristicLength, "actualCharacteristicLength");
  positive(input.actualInterfacialTension, "actualInterfacialTension");
  return {
    value:
      (input.actualAbsolutePhaseDensityDifference *
        input.callerGravity *
        input.actualCharacteristicLength ** 2) /
      input.actualInterfacialTension,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualAbsolutePhaseDensityDifference: 2,
    callerGravity: 1,
    actualCharacteristicLength: 1,
    actualInterfacialTension: 1,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/bond-number",
  title: "Petroleum Bond Number Calculator",
  description:
    "BondnumberBo=|\u0394\u03c1|gL\u00b2/\u03c3,actualgeometryscaleandphases independentlyestablished,no universalcapillarytransport criterion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
