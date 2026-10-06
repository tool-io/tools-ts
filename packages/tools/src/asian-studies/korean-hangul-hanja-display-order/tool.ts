import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedHangul: string;
  readonly suppliedHanja: string;
  readonly hangulFirst: boolean;
};
export type Output = { readonly displayText: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedHangul: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedHanja: { type: "string", maxLength: 8192, minLength: 1 },
    hangulFirst: { type: "boolean" },
  },
  required: ["suppliedHangul", "suppliedHanja", "hangulFirst"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayText: { type: "string", maxLength: 8192 } },
  required: ["displayText"],
} as const;
/** Order explicitly supplied Hangul and Hanja display strings without asserting equivalence or generating readings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedHangul, suppliedHanja, hangulFirst } = request;
  const compute = (): Output => {
    H.domain(
      suppliedHangul.length > 0 && suppliedHanja.length > 0,
      "suppliedHangul",
    );
    return {
      displayText: hangulFirst
        ? suppliedHangul + " (" + suppliedHanja + ")"
        : suppliedHanja + " (" + suppliedHangul + ")",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedHangul: "한글", suppliedHanja: "漢字", hangulFirst: true },
  output: { displayText: "한글 (漢字)" },
} satisfies ToolExample<Input, Output>;
export const koreanHangulHanjaDisplayOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["asian-studies", "asian studies", "humanities"],
      keywords: ["asian studies", "humanities"],
    },
    id: "asian-studies/korean-hangul-hanja-display-order",
    title: "Korean Hangul Hanja Display Order",
    description:
      "Order explicitly supplied Hangul and Hanja display strings without asserting equivalence or generating readings.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedHangul: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedHanja: { type: "string", maxLength: 8192, minLength: 1 },
        hangulFirst: { type: "boolean" },
      },
      required: ["suppliedHangul", "suppliedHanja", "hangulFirst"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { displayText: { type: "string", maxLength: 8192 } },
      required: ["displayText"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedHangul",
          label: "Supplied Hangul",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedHanja",
          label: "Supplied Hanja",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "hangulFirst",
          label: "Hangul First",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "displayText",
          label: "Display Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = koreanHangulHanjaDisplayOrderTool.execute;
export default koreanHangulHanjaDisplayOrderTool;
