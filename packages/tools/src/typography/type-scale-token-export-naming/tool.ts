import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  cssNumber,
  uniqueNames,
} from "../shared.js";
export type Input = Readonly<{
  readonly tokenNames: string;
  readonly tokenSizesRem: readonly number[];
  readonly cssVariablePrefix: string;
}>;
export type Output = Readonly<{ readonly cssCustomProperties: string }>;
const inputFields = [
  { id: "tokenNames", label: "Token names", kind: "string" },
  { id: "tokenSizesRem", label: "Token sizes rem", kind: "numberList" },
  { id: "cssVariablePrefix", label: "Css variable prefix", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.tokenSizesRem.forEach((v) => positive(v, "tokenSizesRem"));
  const names = uniqueNames(input.tokenNames);
  if (uniqueNames(input.cssVariablePrefix).length !== 1)
    simpleError("prefix", "One safe CSS identifier prefix required.");
  aligned(names, input.tokenSizesRem, "tokens");
  return {
    cssCustomProperties: names
      .map(
        (v, i) =>
          `--${input.cssVariablePrefix}-${v}: ${cssNumber(input.tokenSizesRem[i])}rem;`,
      )
      .join("\n"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  tokenNames: "body\nheading",
  tokenSizesRem: [1, 1.5],
  cssVariablePrefix: "type",
} satisfies Input;
export const exampleOutput = {
  cssCustomProperties: "--type-body: 1rem;\n--type-heading: 1.5rem;",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/type-scale-token-export-naming",
  title: "Type Scale Token Naming Export",
  description:
    "Export caller actual named type scale as bounded validated CSS custom properties; strict unique identifiers prevent syntax injection, no invented design-token nomenclature or fixed scale.",
  inputs: inputFields,
  outputs: [
    {
      id: "cssCustomProperties",
      label: "Css custom properties",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      tokenNames: value.tokenNames as string,
      tokenSizesRem: value.tokenSizesRem as readonly number[],
      cssVariablePrefix: value.cssVariablePrefix as string,
    }),
});
export const run = tool.execute;
export default tool;
