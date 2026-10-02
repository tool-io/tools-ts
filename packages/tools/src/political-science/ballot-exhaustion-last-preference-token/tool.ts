import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preferences: readonly string[];
  readonly continuing: readonly string[];
};
export type Output = {
  readonly exhausted: boolean;
  readonly nextPreference: string;
  readonly preferenceIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preferences: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    continuing: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["preferences", "continuing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exhausted: { type: "boolean" },
    nextPreference: { type: "string", maxLength: 8192 },
    preferenceIndex: { type: "integer" },
  },
  required: ["exhausted", "nextPreference", "preferenceIndex"],
} as const;
/** Find the next explicitly continuing preference; does not conduct or certify an election count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preferences, continuing } = request;
  const compute = (): Output => {
    const preferenceIndex = preferences.findIndex((x) =>
      continuing.includes(x),
    );
    return {
      exhausted: preferenceIndex < 0,
      nextPreference: preferenceIndex < 0 ? "" : preferences[preferenceIndex],
      preferenceIndex,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { preferences: ["A", "B", "C"], continuing: ["C"] },
  output: { exhausted: false, nextPreference: "C", preferenceIndex: 2 },
} satisfies ToolExample<Input, Output>;
export const ballotExhaustionLastPreferenceTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "political-science/ballot-exhaustion-last-preference-token",
      title: "Ballot Exhaustion Last Preference Token Tool",
      description:
        "Find the next explicitly continuing preference; does not conduct or certify an election count.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          preferences: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          continuing: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["preferences", "continuing"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exhausted: { type: "boolean" },
          nextPreference: { type: "string", maxLength: 8192 },
          preferenceIndex: { type: "integer" },
        },
        required: ["exhausted", "nextPreference", "preferenceIndex"],
      },
      ports: {
        inputs: [
          {
            id: "preferences",
            label: "Preferences",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "continuing",
            label: "Continuing",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "exhausted",
            label: "Exhausted",
            valueType: { type: "boolean" },
          },
          {
            id: "nextPreference",
            label: "Next Preference",
            valueType: { type: "string" },
          },
          {
            id: "preferenceIndex",
            label: "Preference Index",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ballotExhaustionLastPreferenceTokenTool.execute;
export default ballotExhaustionLastPreferenceTokenTool;
