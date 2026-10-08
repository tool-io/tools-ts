import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interpretationId: string;
  readonly objectionId: string;
};
export type Output = { readonly link: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interpretationId: { type: "string", maxLength: 8192, minLength: 1 },
    objectionId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["interpretationId", "objectionId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { link: { type: "string", maxLength: 8192 } },
  required: ["link"],
} as const;
/** Encode an explicitly asserted interpretation-to-objection relation without evaluating either argument. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interpretationId, objectionId } = request;
  const compute = (): Output => {
    H.domain(
      interpretationId.length > 0 && objectionId.length > 0,
      "interpretationId",
    );
    return { link: JSON.stringify([interpretationId, objectionId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { interpretationId: "I17", objectionId: "O3" },
  output: { link: '["I17","O3"]' },
} satisfies ToolExample<Input, Output>;
export const interpretationObjectionLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["critical-theory", "critical theory", "humanities"],
      keywords: ["critical theory", "humanities"],
    },
    id: "critical-theory/interpretation-objection-link",
    title: "Interpretation Objection Link",
    description:
      "Encode an explicitly asserted interpretation-to-objection relation without evaluating either argument.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interpretationId: { type: "string", maxLength: 8192, minLength: 1 },
        objectionId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["interpretationId", "objectionId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { link: { type: "string", maxLength: 8192 } },
      required: ["link"],
    },
    ports: {
      inputs: [
        {
          id: "interpretationId",
          label: "Interpretation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "objectionId",
          label: "Objection Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "link", label: "Link", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = interpretationObjectionLinkTool.execute;
export default interpretationObjectionLinkTool;
