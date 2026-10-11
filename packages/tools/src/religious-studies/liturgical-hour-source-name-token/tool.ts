import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedHourName: string;
  readonly sourceEdition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedHourName: { type: "string", maxLength: 8192, minLength: 1 },
    sourceEdition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedHourName", "sourceEdition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit liturgical hour name by source edition without calculating schedules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedHourName, sourceEdition } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedHourName.length > 0, "suppliedHourName");
    H.domain(sourceEdition.length > 0, "sourceEdition");
    return {
      token: JSON.stringify([recordId, suppliedHourName, sourceEdition]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedHourName: "Hour name A",
    sourceEdition: "Edition A",
  },
  output: { token: '["R17","Hour name A","Edition A"]' },
} satisfies ToolExample<Input, Output>;
export const liturgicalHourSourceNameTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["religious-studies", "religious studies", "humanities"],
      keywords: ["religious studies", "humanities"],
    },
    id: "religious-studies/liturgical-hour-source-name-token",
    title: "Liturgical Hour Source Name Token",
    description:
      "Qualify an explicit liturgical hour name by source edition without calculating schedules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedHourName: { type: "string", maxLength: 8192, minLength: 1 },
        sourceEdition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "suppliedHourName", "sourceEdition"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedHourName",
          label: "Supplied Hour Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceEdition",
          label: "Source Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = liturgicalHourSourceNameTokenTool.execute;
export default liturgicalHourSourceNameTokenTool;
