import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly keyword: string;
  readonly propertyNormallyInherited: boolean;
  readonly callerParentToken: string;
  readonly callerInitialToken: string;
  readonly callerOriginRollbackToken: string;
}>;
export type Output = Readonly<{ readonly resolvedKeywordToken: string }>;
const inputFields = [
  { id: "keyword", label: "Keyword", kind: "string" },
  {
    id: "propertyNormallyInherited",
    label: "Property normally inherited",
    kind: "boolean",
  },
  { id: "callerParentToken", label: "Caller parent token", kind: "string" },
  { id: "callerInitialToken", label: "Caller initial token", kind: "string" },
  {
    id: "callerOriginRollbackToken",
    label: "Caller origin rollback token",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const k = input.keyword;
  if (!["inherit", "initial", "unset", "revert"].includes(k))
    simpleError("keyword", "Explicit supported CSS-wide keyword.");
  return {
    resolvedKeywordToken:
      k === "inherit" || (k === "unset" && input.propertyNormallyInherited)
        ? input.callerParentToken
        : k === "revert"
          ? input.callerOriginRollbackToken
          : input.callerInitialToken,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  keyword: "unset",
  propertyNormallyInherited: true,
  callerParentToken: "red",
  callerInitialToken: "black",
  callerOriginRollbackToken: "green",
} satisfies Input;
export const exampleOutput = { resolvedKeywordToken: "red" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/inherit-initial-unset-revert-table",
  title: "inherit/initial/unset/revert Resolution Table",
  description:
    "Ordinary property CSS-wide keyword resolution from caller parent/initial/origin-rollback evidence; revert is not always initial and revert-layer is separate. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "resolvedKeywordToken",
      label: "Resolved keyword token",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      keyword: value.keyword as string,
      propertyNormallyInherited: value.propertyNormallyInherited as boolean,
      callerParentToken: value.callerParentToken as string,
      callerInitialToken: value.callerInitialToken as string,
      callerOriginRollbackToken: value.callerOriginRollbackToken as string,
    }),
});
export const run = tool.execute;
export default tool;
