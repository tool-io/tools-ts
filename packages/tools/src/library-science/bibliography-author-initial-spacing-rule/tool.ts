import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initials: readonly string[];
  readonly spaced: boolean;
};
export type Output = { readonly formatted: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initials: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    spaced: { type: "boolean" },
  },
  required: ["initials", "spaced"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { formatted: { type: "string", maxLength: 8192 } },
  required: ["formatted"],
} as const;
/** Format supplied uppercase Latin initials with explicit inter-initial spacing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initials, spaced } = request;
  const compute = (): Output => {
    H.domain(
      initials.length > 0 && initials.every((x) => /^[A-Z](?![\s\S])/.test(x)),
    );
    return { formatted: initials.map((x) => x + ".").join(spaced ? " " : "") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initials: ["J", "R", "R"], spaced: true },
  output: { formatted: "J. R. R." },
} satisfies ToolExample<Input, Output>;
export const bibliographyAuthorInitialSpacingRuleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "library-science/bibliography-author-initial-spacing-rule",
      title: "Bibliography Author Initial Spacing Rule Tool",
      description:
        "Format supplied uppercase Latin initials with explicit inter-initial spacing.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initials: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          spaced: { type: "boolean" },
        },
        required: ["initials", "spaced"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { formatted: { type: "string", maxLength: 8192 } },
        required: ["formatted"],
      },
      ports: {
        inputs: [
          {
            id: "initials",
            label: "Initials",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "spaced",
            label: "Spaced",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "formatted",
            label: "Formatted",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = bibliographyAuthorInitialSpacingRuleTool.execute;
export default bibliographyAuthorInitialSpacingRuleTool;
