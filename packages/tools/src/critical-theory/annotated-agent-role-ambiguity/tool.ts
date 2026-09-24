import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly agent: string;
  readonly roles: readonly string[];
  readonly permittedRoles: readonly string[];
};
export type Output = {
  readonly recognizedRoles: readonly string[];
  readonly ambiguous: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    agent: { type: "string", maxLength: 8192 },
    roles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    permittedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["agent", "roles", "permittedRoles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognizedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    ambiguous: { type: "boolean" },
  },
  required: ["recognizedRoles", "ambiguous"],
} as const;
/** Expose multiple supplied annotation roles without assigning agency or identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { agent, roles, permittedRoles } = request;
  const compute = (): Output => {
    H.domain(agent.length > 0);
    const recognizedRoles = [
      ...new Set(roles.filter((x) => permittedRoles.includes(x))),
    ];
    return { recognizedRoles, ambiguous: recognizedRoles.length > 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    agent: "A",
    roles: ["speaker", "narrator"],
    permittedRoles: ["speaker", "narrator"],
  },
  output: { recognizedRoles: ["speaker", "narrator"], ambiguous: true },
} satisfies ToolExample<Input, Output>;
export const annotatedAgentRoleAmbiguityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "critical-theory/annotated-agent-role-ambiguity",
    title: "Annotated Agent Role Ambiguity Tool",
    description:
      "Expose multiple supplied annotation roles without assigning agency or identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        agent: { type: "string", maxLength: 8192 },
        roles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        permittedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["agent", "roles", "permittedRoles"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognizedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        ambiguous: { type: "boolean" },
      },
      required: ["recognizedRoles", "ambiguous"],
    },
    ports: {
      inputs: [
        {
          id: "agent",
          label: "Agent",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "roles",
          label: "Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "permittedRoles",
          label: "Permitted Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "recognizedRoles",
          label: "Recognized Roles",
          valueType: { type: "list", items: { type: "string" } },
        },
        { id: "ambiguous", label: "Ambiguous", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = annotatedAgentRoleAmbiguityTool.execute;
export default annotatedAgentRoleAmbiguityTool;
