import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly calendarId: string;
  readonly methodCode: string;
  readonly methodSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calendarId: { type: "string", maxLength: 8192, minLength: 1 },
    methodCode: { type: "string", maxLength: 8192, minLength: 1 },
    methodSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["calendarId", "methodCode", "methodSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit prayer-calendar method code and source without calculating times or selecting a method. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { calendarId, methodCode, methodSource } = request;
  const compute = (): Output => {
    H.domain(calendarId.length > 0, "calendarId");
    H.domain(methodCode.length > 0, "methodCode");
    H.domain(methodSource.length > 0, "methodSource");
    return { token: JSON.stringify([calendarId, methodCode, methodSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    calendarId: "CAL17",
    methodCode: "M-A",
    methodSource: "Publisher A",
  },
  output: { token: '["CAL17","M-A","Publisher A"]' },
} satisfies ToolExample<Input, Output>;
export const prayercalendarMethodCodeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["islamic-studies", "islamic studies", "humanities"],
      keywords: ["islamic studies", "humanities"],
    },
    id: "islamic-studies/prayer-calendar-method-code-label",
    title: "Prayer Calendar Method Code Label",
    description:
      "Record an explicit prayer-calendar method code and source without calculating times or selecting a method.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calendarId: { type: "string", maxLength: 8192, minLength: 1 },
        methodCode: { type: "string", maxLength: 8192, minLength: 1 },
        methodSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["calendarId", "methodCode", "methodSource"],
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
          id: "calendarId",
          label: "Calendar Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "methodCode",
          label: "Method Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "methodSource",
          label: "Method Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = prayercalendarMethodCodeLabelTool.execute;
export default prayercalendarMethodCodeLabelTool;
