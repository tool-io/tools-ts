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
  nonnegative,
  integer,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedMatchedTtfBytes: number;
  readonly observedMatchedWoff2Bytes: number;
  readonly independentlySameGlyphContentVerified: boolean;
}>;
export type Output = Readonly<{
  readonly observedWoff2ToTtfRatio: number;
  readonly observedSavingsPercent: number;
}>;
const inputFields = [
  {
    id: "observedMatchedTtfBytes",
    label: "Observed matched ttf bytes",
    kind: "number",
  },
  {
    id: "observedMatchedWoff2Bytes",
    label: "Observed matched woff2 bytes",
    kind: "number",
  },
  {
    id: "independentlySameGlyphContentVerified",
    label: "Independently same glyph content verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedMatchedTtfBytes, "observedMatchedTtfBytes");
  nonnegative(input.observedMatchedWoff2Bytes, "observedMatchedWoff2Bytes");
  integer(input.observedMatchedTtfBytes, "bytes");
  integer(input.observedMatchedWoff2Bytes, "bytes");
  if (!input.independentlySameGlyphContentVerified)
    simpleError("basis", "Independentmatchedglyph/contentbasisrequired.");
  return {
    observedWoff2ToTtfRatio:
      input.observedMatchedWoff2Bytes / input.observedMatchedTtfBytes,
    observedSavingsPercent:
      100 *
      (1 - input.observedMatchedWoff2Bytes / input.observedMatchedTtfBytes),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMatchedTtfBytes: 1000,
  observedMatchedWoff2Bytes: 400,
  independentlySameGlyphContentVerified: true,
} satisfies Input;
export const exampleOutput = {
  observedWoff2ToTtfRatio: 0.4,
  observedSavingsPercent: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/woff2-compression-ratio-ttf-lookup",
  title: "WOFF2 vs TTF Compression Ratio Lookup",
  description:
    "Actual same-content encoded file size ratio with possible negative savings, not invented universal compression percent or subset glyph estimate. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedWoff2ToTtfRatio",
      label: "Observed woff2 to ttf ratio",
      kind: "number",
    },
    {
      id: "observedSavingsPercent",
      label: "Observed savings percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMatchedTtfBytes: value.observedMatchedTtfBytes as number,
      observedMatchedWoff2Bytes: value.observedMatchedWoff2Bytes as number,
      independentlySameGlyphContentVerified:
        value.independentlySameGlyphContentVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
