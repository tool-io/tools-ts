import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch41-shared.js";
export type Input = Readonly<{ readonly observedKoppenCode: string }>;
export type Output = Readonly<{
  readonly mainClimateGroup: string;
  readonly precipitationSubclass: string;
  readonly thermalSubclass: string;
}>;
const inputFields = [
  { id: "observedKoppenCode", label: "Observed koppen code", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !/^(?:A[fmws]|B[WS][hk]|[CD][sfw][abc]|D[sfw]d|E[TF])$/.test(
      input.observedKoppenCode,
    )
  )
    simpleError("code", "SupportedcompleteKöppenGeigercodeonly.");
  const s = input.observedKoppenCode;
  return {
    mainClimateGroup: s[0],
    precipitationSubclass: s[0] === "B" ? s[1] : s[0] === "E" ? "" : s[1],
    thermalSubclass: s.length === 3 ? s[2] : s[0] === "E" ? s[1] : "",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { observedKoppenCode: "Dfb" } satisfies Input;
export const exampleOutput = {
  mainClimateGroup: "D",
  precipitationSubclass: "f",
  thermalSubclass: "b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/koppen-subclass-resolver",
  title: "Koppen Subclass Letter Resolver",
  description:
    "Parse valid Köppen subclass letters by group syntax, does not derive climate from missing monthly data. Caller independently establishes homogeneous observation coverage and model/reference applicability; not observed future climate, crop suitability or validated drought severity.",
  inputs: inputFields,
  outputs: [
    { id: "mainClimateGroup", label: "Main climate group", kind: "string" },
    {
      id: "precipitationSubclass",
      label: "Precipitation subclass",
      kind: "string",
    },
    { id: "thermalSubclass", label: "Thermal subclass", kind: "string" },
  ],
  calculate: (value) =>
    calculate({ observedKoppenCode: value.observedKoppenCode as string }),
});
export const run = tool.execute;
export default tool;
