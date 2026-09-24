import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quotedStart: number;
  readonly quotedEnd: number;
  readonly sourceLength: number;
};
export type Output = { readonly length: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quotedStart: { type: "integer", minimum: 0 },
    quotedEnd: { type: "integer" },
    sourceLength: { type: "integer", minimum: 1 },
  },
  required: ["quotedStart", "quotedEnd", "sourceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { length: { type: "integer" }, share: { type: "number" } },
  required: ["length", "share"],
} as const;
/** Calculate quoted passage span share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quotedStart, quotedEnd, sourceLength } = request;
  const compute = (): Output => {
    H.integer(sourceLength, 1);
    H.integer(quotedStart, 0, sourceLength);
    H.integer(quotedEnd, quotedStart, sourceLength);
    return {
      length: quotedEnd - quotedStart,
      share: (quotedEnd - quotedStart) / sourceLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quotedStart: 10, quotedEnd: 30, sourceLength: 100 },
  output: { length: 20, share: 0.2 },
} satisfies ToolExample<Input, Output>;
export const quotedPassageSpanShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/quoted-passage-span-share",
    title: "Quoted Passage Span Share Tool",
    description:
      "Calculate quoted passage span share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotedStart: { type: "integer", minimum: 0 },
        quotedEnd: { type: "integer" },
        sourceLength: { type: "integer", minimum: 1 },
      },
      required: ["quotedStart", "quotedEnd", "sourceLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { length: { type: "integer" }, share: { type: "number" } },
      required: ["length", "share"],
    },
    ports: {
      inputs: [
        {
          id: "quotedStart",
          label: "Quoted Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "quotedEnd",
          label: "Quoted End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceLength",
          label: "Source Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "length", label: "Length", valueType: { type: "integer" } },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = quotedPassageSpanShareTool.execute;
export default quotedPassageSpanShareTool;
