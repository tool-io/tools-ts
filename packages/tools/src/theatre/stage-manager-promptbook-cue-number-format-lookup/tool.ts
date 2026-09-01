import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, aligned } from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerCuePrefix: string;
  readonly cueWholeNumbers: readonly number[];
  readonly cueSubnumbers: readonly number[];
  readonly callerNumberPaddingDigits: number;
}>;
export type Output = Readonly<{
  readonly formattedPromptbookCueLabels: readonly string[];
}>;
const inputFields = [
  { id: "callerCuePrefix", label: "Caller cue prefix", kind: "string" },
  { id: "cueWholeNumbers", label: "Cue whole numbers", kind: "numberList" },
  { id: "cueSubnumbers", label: "Cue subnumbers", kind: "numberList" },
  {
    id: "callerNumberPaddingDigits",
    label: "Caller number padding digits",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!/^[A-Z][A-Z0-9]{0,7}$(?![\s\S])/.test(input.callerCuePrefix))
    simpleError(
      "prefix",
      "Bounded uppercase alphanumeric caller cue department required.",
    );
  aligned(input.cueWholeNumbers, input.cueSubnumbers, "cues");
  bounded(input.cueWholeNumbers.length, "cues", 1, 128);
  bounded(input.callerNumberPaddingDigits, "padding", 1, 8);
  input.cueWholeNumbers.forEach((v) => bounded(v, "number", 0, 99999999));
  input.cueSubnumbers.forEach((v) => bounded(v, "subnumber", 0, 9999));
  const labels = input.cueWholeNumbers.map(
    (v, i) =>
      `${input.callerCuePrefix} ${String(v).padStart(input.callerNumberPaddingDigits, "0")}${input.cueSubnumbers[i] ? "." + input.cueSubnumbers[i] : ""}`,
  );
  if (new Set(labels).size !== labels.length)
    simpleError("cues", "Duplicate cue identities refused.");
  return { formattedPromptbookCueLabels: labels };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCuePrefix: "LX",
  cueWholeNumbers: [1, 2],
  cueSubnumbers: [0, 5],
  callerNumberPaddingDigits: 3,
} satisfies Input;
export const exampleOutput = {
  formattedPromptbookCueLabels: ["LX 001", "LX 002.5"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/stage-manager-promptbook-cue-number-format-lookup",
  title: "Stage Manager Promptbook Cue Number Format Lookup",
  description:
    "Format actual distinct promptbook cue identifiers under explicit department/padding/subnumber policy; no inferred universal cue syntax, cue execution or collision-prone fractional numeric IDs.",
  inputs: inputFields,
  outputs: [
    {
      id: "formattedPromptbookCueLabels",
      label: "Formatted promptbook cue labels",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCuePrefix: value.callerCuePrefix as string,
      cueWholeNumbers: value.cueWholeNumbers as readonly number[],
      cueSubnumbers: value.cueSubnumbers as readonly number[],
      callerNumberPaddingDigits: value.callerNumberPaddingDigits as number,
    }),
});
export const run = tool.execute;
export default tool;
