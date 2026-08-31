import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, luminance, positive } from "../batch-shared.js";
export type Input = Readonly<{
  readonly opaqueBackgroundRgb: readonly number[];
  readonly callerMinimumContrastRatio: number;
}>;
export type Output = Readonly<{
  readonly blackTextContrastRatio: number;
  readonly whiteTextContrastRatio: number;
  readonly selectedTextHex: string;
  readonly selectedContrastRatio: number;
  readonly meetsCallerContrastPolicy: boolean;
}>;
const inputFields = [
  {
    id: "opaqueBackgroundRgb",
    label: "Opaque background rgb",
    kind: "numberList",
  },
  {
    id: "callerMinimumContrastRatio",
    label: "Caller minimum contrast ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMinimumContrastRatio, "callerMinimumContrastRatio");
  if (input.callerMinimumContrastRatio > 21)
    simpleError(
      "contrast",
      "sRGB black-white contrast policy cannot exceed 21.",
    );
  const L = luminance(input.opaqueBackgroundRgb),
    black = (L + 0.05) / 0.05,
    white = 1.05 / (L + 0.05),
    useBlack = black >= white,
    selected = useBlack ? black : white;
  return {
    blackTextContrastRatio: black,
    whiteTextContrastRatio: white,
    selectedTextHex: useBlack ? "#000000" : "#FFFFFF",
    selectedContrastRatio: selected,
    meetsCallerContrastPolicy: selected >= input.callerMinimumContrastRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  opaqueBackgroundRgb: [0, 0, 0],
  callerMinimumContrastRatio: 4.5,
} satisfies Input;
export const exampleOutput = {
  blackTextContrastRatio: 1,
  whiteTextContrastRatio: 21,
  selectedTextHex: "#FFFFFF",
  selectedContrastRatio: 21,
  meetsCallerContrastPolicy: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/text-on-background-auto-black-white-picker",
  title: "Auto Black/White Text Picker",
  description:
    "Select higher WCAG-style relative-luminance black/white text contrast on actual opaque sRGB background, with deterministic black tie; caller threshold is not full typography, alpha/compositing, WCAG conformance or APCA analysis.",
  inputs: inputFields,
  outputs: [
    {
      id: "blackTextContrastRatio",
      label: "Black text contrast ratio",
      kind: "number",
    },
    {
      id: "whiteTextContrastRatio",
      label: "White text contrast ratio",
      kind: "number",
    },
    { id: "selectedTextHex", label: "Selected text hex", kind: "string" },
    {
      id: "selectedContrastRatio",
      label: "Selected contrast ratio",
      kind: "number",
    },
    {
      id: "meetsCallerContrastPolicy",
      label: "Meets caller contrast policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      opaqueBackgroundRgb: value.opaqueBackgroundRgb as readonly number[],
      callerMinimumContrastRatio: value.callerMinimumContrastRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
