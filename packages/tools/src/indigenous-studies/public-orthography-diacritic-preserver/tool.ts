import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = {
  readonly preservedText: string;
  readonly combiningMarkCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preservedText: { type: "string", maxLength: 8192 },
    combiningMarkCount: { type: "integer" },
  },
  required: ["preservedText", "combiningMarkCount"],
} as const;
/** Preserve public orthographic text exactly and count existing Unicode combining-mark code points without normalizing or stripping diacritics. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text } = request;
  const compute = (): Output => {
    return {
      preservedText: text,
      combiningMarkCount: [...text].filter((c) => /\p{M}/u.test(c)).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "á" },
  output: { preservedText: "á", combiningMarkCount: 1 },
} satisfies ToolExample<Input, Output>;
export const publicOrthographyDiacriticPreserverTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "indigenous-studies/public-orthography-diacritic-preserver",
      title: "Public Orthography Diacritic Preserver Tool",
      description:
        "Preserve public orthographic text exactly and count existing Unicode combining-mark code points without normalizing or stripping diacritics.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { text: { type: "string", maxLength: 8192 } },
        required: ["text"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          preservedText: { type: "string", maxLength: 8192 },
          combiningMarkCount: { type: "integer" },
        },
        required: ["preservedText", "combiningMarkCount"],
      },
      ports: {
        inputs: [
          {
            id: "text",
            label: "Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "preservedText",
            label: "Preserved Text",
            valueType: { type: "string" },
          },
          {
            id: "combiningMarkCount",
            label: "Combining Mark Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = publicOrthographyDiacriticPreserverTool.execute;
export default publicOrthographyDiacriticPreserverTool;
