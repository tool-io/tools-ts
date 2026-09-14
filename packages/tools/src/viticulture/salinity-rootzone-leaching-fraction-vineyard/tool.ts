import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly irrigationEcDsM: number;
  readonly targetSoilEcDsM: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "irrigationEcDsM", label: "Irrigation ec ds m", kind: "number" },
  { id: "targetSoilEcDsM", label: "Target soil ec ds m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.irrigationEcDsM, "ecw");
  positive(i.targetSoilEcDsM, "ece");
  positive(5 * i.targetSoilEcDsM - i.irrigationEcDsM, "denominator");
  if (i.irrigationEcDsM > 2.5 * i.targetSoilEcDsM)
    simpleError("ec", "Required fraction exceeds one.");
  return {
    conditionalLeachingFraction:
      i.irrigationEcDsM / (5 * i.targetSoilEcDsM - i.irrigationEcDsM),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { irrigationEcDsM: 1, targetSoilEcDsM: 2 },
  output: { result: { conditionalLeachingFraction: 0.1111111111111111 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/salinity-rootzone-leaching-fraction-vineyard",
  title: "Salinity Rootzone Leaching Fraction Vineyard Calculator",
  description:
    "Steady-state LR = ECw/(5 ECe - ECw) screening approximation for caller applicable salinity conditions, not universal vineyard leaching advice.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
