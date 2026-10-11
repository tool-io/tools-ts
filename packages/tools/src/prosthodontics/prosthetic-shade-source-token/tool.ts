import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prosthesisId: string;
  readonly shadeCode: string;
  readonly shadeSystem: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prosthesisId: { type: "string", maxLength: 8192, minLength: 1 },
    shadeCode: { type: "string", maxLength: 8192, minLength: 1 },
    shadeSystem: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["prosthesisId", "shadeCode", "shadeSystem"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a supplied prosthetic shade code by its explicit source system without color matching. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prosthesisId, shadeCode, shadeSystem } = request;
  const compute = (): Output => {
    H.domain(prosthesisId.length > 0, "prosthesisId");
    H.domain(shadeCode.length > 0, "shadeCode");
    H.domain(shadeSystem.length > 0, "shadeSystem");
    return { token: JSON.stringify([prosthesisId, shadeCode, shadeSystem]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    prosthesisId: "P17",
    shadeCode: "A2",
    shadeSystem: "Recorded shade system",
  },
  output: { token: '["P17","A2","Recorded shade system"]' },
} satisfies ToolExample<Input, Output>;
export const prostheticShadeSourceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["prosthodontics", "health and medicine"],
      keywords: ["prosthodontics", "health and medicine"],
    },
    id: "prosthodontics/prosthetic-shade-source-token",
    title: "Prosthetic Shade Source Token",
    description:
      "Qualify a supplied prosthetic shade code by its explicit source system without color matching.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prosthesisId: { type: "string", maxLength: 8192, minLength: 1 },
        shadeCode: { type: "string", maxLength: 8192, minLength: 1 },
        shadeSystem: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["prosthesisId", "shadeCode", "shadeSystem"],
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
          id: "prosthesisId",
          label: "Prosthesis Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "shadeCode",
          label: "Shade Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "shadeSystem",
          label: "Shade System",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = prostheticShadeSourceTokenTool.execute;
export default prostheticShadeSourceTokenTool;
