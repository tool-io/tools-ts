import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly instrumentId: string;
  readonly itemId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instrumentId: { type: "string", maxLength: 8192, minLength: 1 },
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["instrumentId", "itemId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit rehabilitation outcome item by instrument version without scoring or validating it. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { instrumentId, itemId, version } = request;
  const compute = (): Output => {
    H.domain(instrumentId.length > 0, "instrumentId");
    H.domain(itemId.length > 0, "itemId");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([instrumentId, itemId, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { instrumentId: "INST17", itemId: "Q3", version: "v2" },
  output: { token: '["INST17","Q3","v2"]' },
} satisfies ToolExample<Input, Output>;
export const rehabilitationOutcomeItemKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["physiotherapy", "health and medicine"],
      keywords: ["physiotherapy", "health and medicine"],
    },
    id: "physiotherapy/rehabilitation-outcome-item-key",
    title: "Rehabilitation Outcome Item Key",
    description:
      "Qualify an explicit rehabilitation outcome item by instrument version without scoring or validating it.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        instrumentId: { type: "string", maxLength: 8192, minLength: 1 },
        itemId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["instrumentId", "itemId", "version"],
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
          id: "instrumentId",
          label: "Instrument Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "itemId",
          label: "Item Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = rehabilitationOutcomeItemKeyTool.execute;
export default rehabilitationOutcomeItemKeyTool;
