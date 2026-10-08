import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly suppliedReason: string };
export type Output = { readonly attributeText: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedReason: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["suppliedReason"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { attributeText: { type: "string", maxLength: 8192 } },
  required: ["attributeText"],
} as const;
/** Escape supplied reason text as a double-quoted TEI gap reason attribute, accepting XML 1.0 characters other than controls without inventing a closed reason vocabulary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedReason } = request;
  const compute = (): Output => {
    H.domain(
      suppliedReason.length > 0 &&
        Array.from(suppliedReason).every((character) => {
          const point = character.codePointAt(0) ?? 0;
          return (
            point >= 0x20 &&
            (point <= 0xd7ff ||
              (point >= 0xe000 && point <= 0xfffd) ||
              (point >= 0x10000 && point <= 0x10ffff))
          );
        }),
      "suppliedReason",
    );
    return {
      attributeText:
        "reason=" +
        String.fromCharCode(34) +
        suppliedReason
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(String.fromCharCode(34), "&quot;") +
        String.fromCharCode(34),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedReason: "illegible" },
  output: { attributeText: 'reason="illegible"' },
} satisfies ToolExample<Input, Output>;
export const teiGapReasonAttributeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/tei-gap-reason-attribute-label",
    title: "TEI Gap Reason Attribute Label Tool",
    description:
      "Escape supplied reason text as a double-quoted TEI gap reason attribute, accepting XML 1.0 characters other than controls without inventing a closed reason vocabulary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedReason: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["suppliedReason"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { attributeText: { type: "string", maxLength: 8192 } },
      required: ["attributeText"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedReason",
          label: "Supplied Reason",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "attributeText",
          label: "Attribute Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = teiGapReasonAttributeLabelTool.execute;
export default teiGapReasonAttributeLabelTool;
