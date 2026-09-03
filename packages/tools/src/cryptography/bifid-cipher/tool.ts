import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fractionate } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly text: string;
  readonly callerAlphabet: string;
  readonly period: number;
  readonly decode: boolean;
}>;
export type Output = Readonly<{ readonly transformed: string }>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "callerAlphabet", label: "Caller alphabet", kind: "string" },
  { id: "period", label: "Period", kind: "number" },
  { id: "decode", label: "Decode", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    transformed: fractionate(
      input.text,
      input.callerAlphabet,
      2,
      input.period,
      input.decode,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  text: "ABC",
  callerAlphabet: "ABCDEFGHIKLMNOPQRSTUVWXYZ",
  period: 3,
  decode: false,
} satisfies Input;
export const exampleOutput = { transformed: "AAH" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/bifid-cipher",
  title: "Bifid Cipher Tool",
  description:
    "Explicit Bifid coordinate fractionation in bounded caller periods; alphabet order and decode explicit. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [{ id: "transformed", label: "Transformed", kind: "string" }],
  calculate: (value) =>
    calculate({
      text: value.text as string,
      callerAlphabet: value.callerAlphabet as string,
      period: value.period as number,
      decode: value.decode as boolean,
    }),
});
export const run = tool.execute;
export default tool;
