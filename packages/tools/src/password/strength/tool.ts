import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type PasswordStrengthBand =
  | "excellent"
  | "fair"
  | "good"
  | "poor"
  | "very-poor";

export type PasswordStrengthInput = {
  readonly password: string;
};

export type PasswordStrengthOutput = {
  readonly characterPoolSize: number;
  readonly entropyBits: number;
  readonly length: number;
  readonly band: PasswordStrengthBand;
};

const round2 = (value: number): number => Math.round(value * 100) / 100;

/** Offline attack bands on entropy bits (lower bound of each band). */
const BANDS: readonly { floor: number; name: PasswordStrengthBand }[] = [
  { floor: 0, name: "very-poor" },
  { floor: 36, name: "poor" },
  { floor: 60, name: "fair" },
  { floor: 80, name: "good" },
  { floor: 112, name: "excellent" },
];

export const passwordStrengthInputSchema = {
  additionalProperties: false,
  properties: {
    password: {
      description:
        "Password characters to assess; only the pool-size estimate leaves this tool.",
      maxLength: 1024,
      minLength: 1,
      type: "string",
    },
  },
  required: ["password"],
  type: "object",
} as const;

export const passwordStrengthOutputSchema = {
  additionalProperties: false,
  properties: {
    band: {
      description: "Offline-attack resistance classification.",
      enum: ["excellent", "fair", "good", "poor", "very-poor"],
      type: "string",
    },
    characterPoolSize: {
      description: "Size of the detected character-class pool.",
      minimum: 0,
      type: "integer",
    },
    entropyBits: {
      description: "Length times log2(pool size), rounded to two decimals.",
      minimum: 0,
      type: "number",
    },
    length: {
      description: "Password length in characters.",
      minimum: 1,
      type: "integer",
    },
  },
  required: ["band", "characterPoolSize", "entropyBits", "length"],
  type: "object",
} as const;

export const passwordStrengthExample = {
  input: { password: "Tr0ub4dor&3xyZ" },
  output: {
    band: "good",
    characterPoolSize: 94,
    entropyBits: 91.76,
    length: 14,
  },
} satisfies ToolExample<PasswordStrengthInput, PasswordStrengthOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isPasswordStrengthOutput = (
  value: unknown,
): value is PasswordStrengthOutput =>
  isRecord(value) &&
  typeof value.band === "string" &&
  Number.isSafeInteger(value.characterPoolSize);

export const calculatePasswordStrength = (
  input: unknown,
): ToolResult<PasswordStrengthOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (field !== "password")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const raw = input.password;
  if (raw === undefined)
    return invalidInput([
      ...issues,
      {
        code: "password_required",
        field: "password",
        message: "password is required.",
      },
    ]);
  if (typeof raw !== "string")
    return invalidInput([
      ...issues,
      {
        code: "password_invalid",
        field: "password",
        message: "password must be a string.",
      },
    ]);
  if (raw.length < 1)
    return invalidInput([
      ...issues,
      {
        code: "password_empty",
        field: "password",
        message: "password must contain at least one character.",
      },
    ]);
  if (raw.length > 1024)
    return invalidInput([
      ...issues,
      {
        code: "resource_limit_exceeded",
        field: "password",
        message: "password must not exceed 1024 characters.",
      },
    ]);
  if (issues.length > 0) return invalidInput(issues);

  let pool = 0;
  if (/[a-z]/.test(raw)) pool += 26;
  if (/[A-Z]/.test(raw)) pool += 26;
  if (/[0-9]/.test(raw)) pool += 10;
  // Everything else counts as the printable-symbol class.
  if (/[^a-zA-Z0-9]/.test(raw)) pool += 32;

  const entropyBits = round2(raw.length * Math.log2(pool));
  let band: PasswordStrengthBand = BANDS[0].name;
  for (const candidate of BANDS)
    if (entropyBits >= candidate.floor) band = candidate.name;

  return toolSuccess({
    band,
    characterPoolSize: pool,
    entropyBits,
    length: raw.length,
  });
};

export const passwordStrengthTool = defineTool<
  PasswordStrengthInput,
  PasswordStrengthOutput
>({
  contractVersion: 1,
  description:
    "Estimate offline-attack strength from character-class pool size and length, never storing or transmitting the secret.",
  discovery: {
    aliases: ["password-checker", "password-meter"],
    keywords: ["entropy", "password", "security", "strength"],
  },
  execute: calculatePasswordStrength,
  execution: { kind: "pure" },
  id: "password/strength",
  inputSchema: passwordStrengthInputSchema,
  outputSchema: passwordStrengthOutputSchema,
  ports: {
    inputs: [
      {
        description: "Password characters to assess.",
        id: "password",
        label: "Password",
        required: true,
        valueType: { format: "secret/password", type: "string" },
      },
    ],
    outputs: [
      {
        description: "Offline-attack resistance classification.",
        id: "band",
        label: "Strength band",
        valueType: { format: "strength-band", type: "string" },
      },
      {
        description: "Estimated entropy in bits.",
        id: "entropyBits",
        label: "Entropy",
        valueType: { format: "information", type: "number", unit: "bits" },
      },
      {
        description: "Detected character-class pool size.",
        id: "characterPoolSize",
        label: "Pool size",
        valueType: { format: "count", type: "integer" },
      },
      {
        description: "Password length in characters.",
        id: "length",
        label: "Length",
        valueType: { format: "count", type: "integer" },
      },
    ],
  },
  title: "Password Strength",
});

export const runPasswordStrength = passwordStrengthTool.execute;
export default passwordStrengthTool;
