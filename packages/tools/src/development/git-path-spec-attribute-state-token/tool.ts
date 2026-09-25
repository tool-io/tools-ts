import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requirement: string;
  readonly state: string;
  readonly value: string;
};
export type Output = { readonly matches: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requirement: { type: "string", maxLength: 8192 },
    state: {
      type: "string",
      maxLength: 8192,
      enum: ["set", "unset", "unspecified", "value"],
    },
    value: { type: "string", maxLength: 8192 },
  },
  required: ["requirement", "state", "value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matches: { type: "boolean" } },
  required: ["matches"],
} as const;
/** Evaluate one Git pathspec attribute requirement against an explicitly supplied attribute state. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requirement, state, value } = request;
  const compute = (): Output => {
    H.domain(["set", "unset", "unspecified", "value"].includes(state));
    const match = /^(!|-)?([A-Za-z0-9_.-]+)(?:=(.*))?(?![\s\S])/.exec(
      requirement,
    );
    H.domain(match !== null && !(match[1] && match[3] !== undefined));
    return {
      matches:
        match[1] === "!"
          ? state === "unspecified"
          : match[1] === "-"
            ? state === "unset"
            : match[3] !== undefined
              ? state === "value" && value === match[3]
              : state === "set",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requirement: "!vendored", state: "unspecified", value: "" },
  output: { matches: true },
} satisfies ToolExample<Input, Output>;
export const gitPathSpecAttributeStateTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/git-path-spec-attribute-state-token",
    title: "Git Path Spec Attribute State Token Tool",
    description:
      "Evaluate one Git pathspec attribute requirement against an explicitly supplied attribute state.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requirement: { type: "string", maxLength: 8192 },
        state: {
          type: "string",
          maxLength: 8192,
          enum: ["set", "unset", "unspecified", "value"],
        },
        value: { type: "string", maxLength: 8192 },
      },
      required: ["requirement", "state", "value"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { matches: { type: "boolean" } },
      required: ["matches"],
    },
    ports: {
      inputs: [
        {
          id: "requirement",
          label: "Requirement",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "state",
          label: "State",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = gitPathSpecAttributeStateTokenTool.execute;
export default gitPathSpecAttributeStateTokenTool;
