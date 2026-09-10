import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualDesignation: string;
  readonly callerRegionPrefix: string;
  readonly callerRequiredDigitWidth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualDesignation", label: "Actual designation", kind: "string" },
  { id: "callerRegionPrefix", label: "Caller region prefix", kind: "string" },
  {
    id: "callerRequiredDigitWidth",
    label: "Caller required digit width",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.callerRequiredDigitWidth, "width", 1, 20);
  if (!/^[A-Za-z0-9]{1,32}$/.test(input.callerRegionPrefix))
    simpleError("prefix", "Actual bounded ASCII regionprefix.");
  return {
    matchesCallerScheme:
      input.actualDesignation ===
        input.callerRegionPrefix +
          "-" +
          input.actualDesignation.slice(input.callerRegionPrefix.length + 1) &&
      input.actualDesignation.startsWith(input.callerRegionPrefix + "-") &&
      new RegExp("^[0-9]{" + input.callerRequiredDigitWidth + "}$").test(
        input.actualDesignation.slice(input.callerRegionPrefix.length + 1),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDesignation: "REG-012",
    callerRegionPrefix: "REG",
    callerRequiredDigitWidth: 3,
  },
  output: { result: { matchesCallerScheme: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/designation-number-validator",
  title: "Cave Designation Numbering Scheme Validator",
  description:
    "Actual cave designation syntax callerPREFIX-hyphen-exact ASCII digit width. No numbering allocation, registry authority, uniqueness or universal regional naming scheme.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
