import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly procedureId: string;
  readonly toothSiteCode: string;
  readonly notationSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    procedureId: { type: "string", maxLength: 8192, minLength: 1 },
    toothSiteCode: { type: "string", maxLength: 8192, minLength: 1 },
    notationSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["procedureId", "toothSiteCode", "notationSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit oral-surgery tooth/site code by its notation source without anatomical lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { procedureId, toothSiteCode, notationSource } = request;
  const compute = (): Output => {
    H.domain(procedureId.length > 0, "procedureId");
    H.domain(toothSiteCode.length > 0, "toothSiteCode");
    H.domain(notationSource.length > 0, "notationSource");
    return {
      token: JSON.stringify([procedureId, toothSiteCode, notationSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    procedureId: "OS17",
    toothSiteCode: "SITE3",
    notationSource: "Notation A",
  },
  output: { token: '["OS17","SITE3","Notation A"]' },
} satisfies ToolExample<Input, Output>;
export const oralSurgeryToothSiteCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oral-surgery", "oral surgery", "health and medicine"],
      keywords: ["oral surgery", "health and medicine"],
    },
    id: "oral-surgery/oral-surgery-tooth-site-code",
    title: "Oral Surgery Tooth Site Code",
    description:
      "Qualify an explicit oral-surgery tooth/site code by its notation source without anatomical lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        procedureId: { type: "string", maxLength: 8192, minLength: 1 },
        toothSiteCode: { type: "string", maxLength: 8192, minLength: 1 },
        notationSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["procedureId", "toothSiteCode", "notationSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "procedureId",
          label: "Procedure Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "toothSiteCode",
          label: "Tooth Site Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "notationSource",
          label: "Notation Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = oralSurgeryToothSiteCodeTool.execute;
export default oralSurgeryToothSiteCodeTool;
