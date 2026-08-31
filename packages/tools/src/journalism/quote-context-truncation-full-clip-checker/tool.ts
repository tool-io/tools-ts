import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, codepoints } from "../batch-shared.js";
export type Input = Readonly<{
  readonly fullSourceClipText: string;
  readonly quoteStartCodepointOffset: number;
  readonly quoteEndExclusiveCodepointOffset: number;
  readonly publishedQuoteText: string;
  readonly callerMinimumContextCodepointsEachSide: number;
}>;
export type Output = Readonly<{
  readonly extractedSourceQuoteText: string;
  readonly publishedQuoteMatchesExactSourceSlice: boolean;
  readonly availableContextCodepointsBefore: number;
  readonly availableContextCodepointsAfter: number;
  readonly callerContextBudgetAvailable: boolean;
}>;
const inputFields = [
  { id: "fullSourceClipText", label: "Full source clip text", kind: "string" },
  {
    id: "quoteStartCodepointOffset",
    label: "Quote start codepoint offset",
    kind: "number",
  },
  {
    id: "quoteEndExclusiveCodepointOffset",
    label: "Quote end exclusive codepoint offset",
    kind: "number",
  },
  { id: "publishedQuoteText", label: "Published quote text", kind: "string" },
  {
    id: "callerMinimumContextCodepointsEachSide",
    label: "Caller minimum context codepoints each side",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const points = codepoints(input.fullSourceClipText);
  bounded(input.quoteStartCodepointOffset, "start", 0, points.length);
  bounded(
    input.quoteEndExclusiveCodepointOffset,
    "end",
    input.quoteStartCodepointOffset,
    points.length,
  );
  bounded(input.callerMinimumContextCodepointsEachSide, "context", 0, 65536);
  const quote = points
      .slice(
        input.quoteStartCodepointOffset,
        input.quoteEndExclusiveCodepointOffset,
      )
      .join(""),
    before = input.quoteStartCodepointOffset,
    after = points.length - input.quoteEndExclusiveCodepointOffset;
  return {
    extractedSourceQuoteText: quote,
    publishedQuoteMatchesExactSourceSlice: quote === input.publishedQuoteText,
    availableContextCodepointsBefore: before,
    availableContextCodepointsAfter: after,
    callerContextBudgetAvailable:
      before >= input.callerMinimumContextCodepointsEachSide &&
      after >= input.callerMinimumContextCodepointsEachSide,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fullSourceClipText: "Before quoted words after",
  quoteStartCodepointOffset: 7,
  quoteEndExclusiveCodepointOffset: 19,
  publishedQuoteText: "quoted words",
  callerMinimumContextCodepointsEachSide: 5,
} satisfies Input;
export const exampleOutput = {
  extractedSourceQuoteText: "quoted words",
  publishedQuoteMatchesExactSourceSlice: true,
  availableContextCodepointsBefore: 7,
  availableContextCodepointsAfter: 6,
  callerContextBudgetAvailable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/quote-context-truncation-full-clip-checker",
  title: "Quote Context Truncation Full Clip Checker",
  description:
    "Audit exact published quote against caller codepoint source slice and available surrounding context budget; no semantic faithful-context judgment, factual verification, inferred ellipsis substitution or copyright authorization.",
  inputs: inputFields,
  outputs: [
    {
      id: "extractedSourceQuoteText",
      label: "Extracted source quote text",
      kind: "string",
    },
    {
      id: "publishedQuoteMatchesExactSourceSlice",
      label: "Published quote matches exact source slice",
      kind: "boolean",
    },
    {
      id: "availableContextCodepointsBefore",
      label: "Available context codepoints before",
      kind: "number",
    },
    {
      id: "availableContextCodepointsAfter",
      label: "Available context codepoints after",
      kind: "number",
    },
    {
      id: "callerContextBudgetAvailable",
      label: "Caller context budget available",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      fullSourceClipText: value.fullSourceClipText as string,
      quoteStartCodepointOffset: value.quoteStartCodepointOffset as number,
      quoteEndExclusiveCodepointOffset:
        value.quoteEndExclusiveCodepointOffset as number,
      publishedQuoteText: value.publishedQuoteText as string,
      callerMinimumContextCodepointsEachSide:
        value.callerMinimumContextCodepointsEachSide as number,
    }),
});
export const run = tool.execute;
export default tool;
