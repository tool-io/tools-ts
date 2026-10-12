import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  cuesJson: string;
  numerator: number;
  denominator: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "cuesJson", kind: "string", label: "cuesJson" },
  { id: "numerator", kind: "integer", label: "numerator" },
  { id: "denominator", kind: "integer", label: "denominator" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.cueRecords(i.cuesJson);
  H.int(i.numerator, 1, 1e6);
  H.int(i.denominator, 1, 1e6);
  const scale = (t: number) => {
    const n = BigInt(t) * BigInt(i.numerator),
      d = BigInt(i.denominator);
    H.check(
      n % d === 0n,
      "Fractional milliseconds require a separate rounding policy",
    );
    return Number(n / d);
  };
  return H.finish({
    cues: r.map((v) => ({ ...v, start: scale(v.start), end: scale(v.end) })),
  });
};
export const example = {
  input: {
    cuesJson:
      '[{"id":"a","start":0,"end":4,"text":"hi"},{"id":"b","start":3,"end":6,"text":"hi"}]',
    numerator: 2,
    denominator: 1,
  },
  output: {
    result: {
      cues: [
        { id: "a", start: 0, end: 8, text: "hi" },
        { id: "b", start: 6, end: 12, text: "hi" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "caption/cue-time-rational-scaler",
  title: "Caption Cue Time Rational Scaler",
  description:
    "Scale cue endpoints by a positive rational factor exactly; reject fractional milliseconds rather than inventing a rounding policy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cues: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                id: { type: "string" },
                text: { type: "string" },
                start: { type: "number" },
                end: { type: "number" },
              },
              required: ["id", "text", "start", "end"],
            },
          },
        },
        required: ["cues"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
