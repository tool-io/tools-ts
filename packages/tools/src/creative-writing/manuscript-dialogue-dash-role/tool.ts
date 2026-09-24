import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly dialogueDash: string;
  readonly interruptionDash: string;
  readonly suppliedRole: string;
};
export type Output = {
  readonly matchesRole: boolean;
  readonly ambiguous: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    dialogueDash: { type: "string", maxLength: 8192 },
    interruptionDash: { type: "string", maxLength: 8192 },
    suppliedRole: {
      type: "string",
      maxLength: 8192,
      enum: ["dialogue", "interruption"],
    },
  },
  required: ["token", "dialogueDash", "interruptionDash", "suppliedRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchesRole: { type: "boolean" },
    ambiguous: { type: "boolean" },
  },
  required: ["matchesRole", "ambiguous"],
} as const;
/** Compare editorial dash tokens while exposing an ambiguous shared glyph. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, dialogueDash, interruptionDash, suppliedRole } = request;
  const compute = (): Output => {
    H.domain(["dialogue", "interruption"].includes(suppliedRole));
    return {
      matchesRole:
        token ===
        (suppliedRole === "dialogue" ? dialogueDash : interruptionDash),
      ambiguous: token === dialogueDash && token === interruptionDash,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    token: "—",
    dialogueDash: "—",
    interruptionDash: "–",
    suppliedRole: "dialogue",
  },
  output: { matchesRole: true, ambiguous: false },
} satisfies ToolExample<Input, Output>;
export const manuscriptDialogueDashRoleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/manuscript-dialogue-dash-role",
    title: "Manuscript Dialogue Dash Role Tool",
    description:
      "Compare editorial dash tokens while exposing an ambiguous shared glyph.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        dialogueDash: { type: "string", maxLength: 8192 },
        interruptionDash: { type: "string", maxLength: 8192 },
        suppliedRole: {
          type: "string",
          maxLength: 8192,
          enum: ["dialogue", "interruption"],
        },
      },
      required: ["token", "dialogueDash", "interruptionDash", "suppliedRole"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matchesRole: { type: "boolean" },
        ambiguous: { type: "boolean" },
      },
      required: ["matchesRole", "ambiguous"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dialogueDash",
          label: "Dialogue Dash",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "interruptionDash",
          label: "Interruption Dash",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedRole",
          label: "Supplied Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "matchesRole",
          label: "Matches Role",
          valueType: { type: "boolean" },
        },
        { id: "ambiguous", label: "Ambiguous", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = manuscriptDialogueDashRoleTool.execute;
export default manuscriptDialogueDashRoleTool;
