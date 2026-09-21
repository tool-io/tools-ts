import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly birthToken: string;
  readonly unknownTokens: readonly string[];
  readonly observationDay: number;
  readonly birthDay: number;
};
export type Output = { readonly birthKnown: boolean; readonly ageDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    birthToken: { type: "string", maxLength: 8192 },
    unknownTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    observationDay: { type: "integer" },
    birthDay: { type: "integer" },
  },
  required: ["birthToken", "unknownTokens", "observationDay", "birthDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { birthKnown: { type: "boolean" }, ageDays: { type: "integer" } },
  required: ["birthKnown", "ageDays"],
} as const;
/** Retain unknown birth metadata separately from a supplied age calculation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { birthToken, unknownTokens, observationDay, birthDay } = request;
  const compute = (): Output => {
    const birthKnown = !unknownTokens.includes(birthToken);
    H.domain(!birthKnown || observationDay >= birthDay);
    return { birthKnown, ageDays: birthKnown ? observationDay - birthDay : 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    birthToken: "?",
    unknownTokens: ["?", ""],
    observationDay: 100,
    birthDay: 0,
  },
  output: { birthKnown: false, ageDays: 0 },
} satisfies ToolExample<Input, Output>;
export const herdRosterUnknownBirthTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/herd-roster-unknown-birth-token",
    title: "Herd Roster Unknown Birth Token Tool",
    description:
      "Retain unknown birth metadata separately from a supplied age calculation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        birthToken: { type: "string", maxLength: 8192 },
        unknownTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        observationDay: { type: "integer" },
        birthDay: { type: "integer" },
      },
      required: ["birthToken", "unknownTokens", "observationDay", "birthDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        birthKnown: { type: "boolean" },
        ageDays: { type: "integer" },
      },
      required: ["birthKnown", "ageDays"],
    },
    ports: {
      inputs: [
        {
          id: "birthToken",
          label: "Birth Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unknownTokens",
          label: "Unknown Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "observationDay",
          label: "Observation Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "birthDay",
          label: "Birth Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "birthKnown",
          label: "Birth Known",
          valueType: { type: "boolean" },
        },
        { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = herdRosterUnknownBirthTokenTool.execute;
export default herdRosterUnknownBirthTokenTool;
