import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly seleucidYear: number;
  readonly callerVerifiedConvention: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seleucidYear", label: "Seleucid year", kind: "number" },
  {
    id: "callerVerifiedConvention",
    label: "Caller verified convention",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.seleucidYear, "SE year", 1, 10000);
  if (
    !["Syrian-autumn", "Babylonian-spring"].includes(
      input.callerVerifiedConvention,
    )
  )
    simpleError(
      "convention",
      "Explicit independently verified Seleucid new-year convention.",
    );
  const y =
      (input.callerVerifiedConvention === "Syrian-autumn" ? -311 : -310) +
      input.seleucidYear -
      1,
    label = (v: number) =>
      v <= 0 ? String(1 - v) + " BCE" : String(v) + " CE";
  return {
    startCivilYearLabel: label(y),
    endCivilYearLabel: label(y + 1),
    startSeason:
      input.callerVerifiedConvention === "Syrian-autumn" ? "autumn" : "spring",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { seleucidYear: 1, callerVerifiedConvention: "Syrian-autumn" },
  output: {
    result: {
      startCivilYearLabel: "312 BCE",
      endCivilYearLabel: "311 BCE",
      startSeason: "autumn",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/seleucid-era-to-bc-conversion-calculator",
  title: "Seleucid Era to Bc Conversion Calculator",
  description:
    "Nominal Seleucid year span under caller independently established Syrian-autumn312 BCE or Babylonian-spring311 BCE epoch. No civil year zero; no mint-date/lunisolar day conversion or assertion that an undated record follows one convention.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
