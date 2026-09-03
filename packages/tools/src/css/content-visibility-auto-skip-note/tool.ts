import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, pick } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly contentVisibility: string;
  readonly uaRelevantToUser: boolean;
  readonly callerIntrinsicPlaceholderHeightPx: number;
}>;
export type Output = Readonly<{
  readonly eligibleForUaRenderSkipping: boolean;
  readonly retainedPlaceholderHeightPx: number;
}>;
const inputFields = [
  { id: "contentVisibility", label: "Content visibility", kind: "string" },
  { id: "uaRelevantToUser", label: "Ua relevant to user", kind: "boolean" },
  {
    id: "callerIntrinsicPlaceholderHeightPx",
    label: "Caller intrinsic placeholder height px",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerIntrinsicPlaceholderHeightPx,
    "callerIntrinsicPlaceholderHeightPx",
  );
  pick(
    input.contentVisibility,
    { visible: 0, auto: 1, hidden: 2 },
    "visibility",
  );
  return {
    eligibleForUaRenderSkipping:
      input.contentVisibility === "hidden" ||
      (input.contentVisibility === "auto" && !input.uaRelevantToUser),
    retainedPlaceholderHeightPx: input.callerIntrinsicPlaceholderHeightPx,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  contentVisibility: "auto",
  uaRelevantToUser: false,
  callerIntrinsicPlaceholderHeightPx: 300,
} satisfies Input;
export const exampleOutput = {
  eligibleForUaRenderSkipping: true,
  retainedPlaceholderHeightPx: 300,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/content-visibility-auto-skip-note",
  title: "content-visibility:auto Render Skip Note",
  description:
    "Audit explicit content-visibility and independently observed UA relevance; auto may skip rendering while retaining layout/accessibility semantics, placeholder already computed independently. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "eligibleForUaRenderSkipping",
      label: "Eligible for ua render skipping",
      kind: "boolean",
    },
    {
      id: "retainedPlaceholderHeightPx",
      label: "Retained placeholder height px",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      contentVisibility: value.contentVisibility as string,
      uaRelevantToUser: value.uaRelevantToUser as boolean,
      callerIntrinsicPlaceholderHeightPx:
        value.callerIntrinsicPlaceholderHeightPx as number,
    }),
});
export const run = tool.execute;
export default tool;
