import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly created: number;
  readonly retentionLower: number;
  readonly retentionUpper: number;
  readonly now: number;
};
export type Output = {
  readonly expiryLower: number;
  readonly expiryUpper: number;
  readonly certainlyExpired: boolean;
  readonly possiblyExpired: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    created: { type: "integer" },
    retentionLower: { type: "integer", minimum: 0 },
    retentionUpper: { type: "integer" },
    now: { type: "integer" },
  },
  required: ["created", "retentionLower", "retentionUpper", "now"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiryLower: { type: "integer" },
    expiryUpper: { type: "integer" },
    certainlyExpired: { type: "boolean" },
    possiblyExpired: { type: "boolean" },
  },
  required: [
    "expiryLower",
    "expiryUpper",
    "certainlyExpired",
    "possiblyExpired",
  ],
} as const;
/** Propagate caller-supplied retention bounds without selecting privacy rules or deleting templates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { created, retentionLower, retentionUpper, now } = request;
  const compute = (): Output => {
    H.integer(retentionLower, 0);
    H.integer(retentionUpper, retentionLower);
    return {
      expiryLower: created + retentionLower,
      expiryUpper: created + retentionUpper,
      certainlyExpired: now > created + retentionUpper,
      possiblyExpired: now > created + retentionLower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { created: 10, retentionLower: 20, retentionUpper: 30, now: 35 },
  output: {
    expiryLower: 30,
    expiryUpper: 40,
    certainlyExpired: false,
    possiblyExpired: true,
  },
} satisfies ToolExample<Input, Output>;
export const templateRetentionWindowBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/template-retention-window-bound",
    title: "Template Retention Window Bound Tool",
    description:
      "Propagate caller-supplied retention bounds without selecting privacy rules or deleting templates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        created: { type: "integer" },
        retentionLower: { type: "integer", minimum: 0 },
        retentionUpper: { type: "integer" },
        now: { type: "integer" },
      },
      required: ["created", "retentionLower", "retentionUpper", "now"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expiryLower: { type: "integer" },
        expiryUpper: { type: "integer" },
        certainlyExpired: { type: "boolean" },
        possiblyExpired: { type: "boolean" },
      },
      required: [
        "expiryLower",
        "expiryUpper",
        "certainlyExpired",
        "possiblyExpired",
      ],
    },
    ports: {
      inputs: [
        {
          id: "created",
          label: "Created",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "retentionLower",
          label: "Retention Lower",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "retentionUpper",
          label: "Retention Upper",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "now",
          label: "Now",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "expiryLower",
          label: "Expiry Lower",
          valueType: { type: "integer" },
        },
        {
          id: "expiryUpper",
          label: "Expiry Upper",
          valueType: { type: "integer" },
        },
        {
          id: "certainlyExpired",
          label: "Certainly Expired",
          valueType: { type: "boolean" },
        },
        {
          id: "possiblyExpired",
          label: "Possibly Expired",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = templateRetentionWindowBoundTool.execute;
export default templateRetentionWindowBoundTool;
