import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly identifierText: string };
export type Output = {
  readonly preservedIdentifier: string;
  readonly leadingZeroCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { identifierText: { type: "string", maxLength: 8192 } },
  required: ["identifierText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preservedIdentifier: { type: "string", maxLength: 8192 },
    leadingZeroCount: { type: "integer" },
  },
  required: ["preservedIdentifier", "leadingZeroCount"],
} as const;
/** Preserve a supplied decimal healthcare identifier as text and count leading zeros without converting it to a number or verifying identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifierText } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(/^[0-9]+(?![\s\S])/.test(identifierText), "identifierText");
      const leadingZeroCount = /^0*/.exec(identifierText)?.[0].length ?? 0;
      return { preservedIdentifier: identifierText, leadingZeroCount };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { identifierText: "00124" },
  output: { preservedIdentifier: "00124", leadingZeroCount: 2 },
} satisfies ToolExample<Input, Output>;
export const healthcareIdentifierLeadingZeroPreservationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-informatics/healthcare-identifier-leading-zero-preservation",
      title: "Healthcare Identifier Leading Zero Preservation Tool",
      description:
        "Preserve a supplied decimal healthcare identifier as text and count leading zeros without converting it to a number or verifying identity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { identifierText: { type: "string", maxLength: 8192 } },
        required: ["identifierText"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          preservedIdentifier: { type: "string", maxLength: 8192 },
          leadingZeroCount: { type: "integer" },
        },
        required: ["preservedIdentifier", "leadingZeroCount"],
      },
      ports: {
        inputs: [
          {
            id: "identifierText",
            label: "Identifier Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "preservedIdentifier",
            label: "Preserved Identifier",
            valueType: { type: "string" },
          },
          {
            id: "leadingZeroCount",
            label: "Leading Zero Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthcareIdentifierLeadingZeroPreservationTool.execute;
export default healthcareIdentifierLeadingZeroPreservationTool;
