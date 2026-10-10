import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly agreementId: string;
  readonly agentId: string;
  readonly territoryText: string;
  readonly suppliedExclusivity: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    agreementId: { type: "string", maxLength: 8192, minLength: 1 },
    agentId: { type: "string", maxLength: 8192, minLength: 1 },
    territoryText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedExclusivity: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["agreementId", "agentId", "territoryText", "suppliedExclusivity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit foreign-agent territory and exclusivity assertions without interpreting or enforcing agreements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { agreementId, agentId, territoryText, suppliedExclusivity } = request;
  const compute = (): Output => {
    H.domain(agreementId.length > 0, "agreementId");
    H.domain(agentId.length > 0, "agentId");
    H.domain(territoryText.length > 0, "territoryText");
    H.domain(suppliedExclusivity.length > 0, "suppliedExclusivity");
    return {
      token: JSON.stringify([
        agreementId,
        agentId,
        territoryText,
        suppliedExclusivity,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    agreementId: "A17",
    agentId: "G4",
    territoryText: "Region A",
    suppliedExclusivity: "exclusive",
  },
  output: { token: '["A17","G4","Region A","exclusive"]' },
} satisfies ToolExample<Input, Output>;
export const foreignAgentTerritoryExclusivityTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-business/foreign-agent-territory-exclusivity-token",
      title: "Foreign Agent Territory Exclusivity Token Tool",
      description:
        "Preserve explicit foreign-agent territory and exclusivity assertions without interpreting or enforcing agreements.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          agreementId: { type: "string", maxLength: 8192, minLength: 1 },
          agentId: { type: "string", maxLength: 8192, minLength: 1 },
          territoryText: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedExclusivity: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: [
          "agreementId",
          "agentId",
          "territoryText",
          "suppliedExclusivity",
        ],
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
            id: "agreementId",
            label: "Agreement Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "agentId",
            label: "Agent Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "territoryText",
            label: "Territory Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedExclusivity",
            label: "Supplied Exclusivity",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = foreignAgentTerritoryExclusivityTokenTool.execute;
export default foreignAgentTerritoryExclusivityTokenTool;
