import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly setupSeconds: number;
  readonly clampSecondsPerPart: number;
  readonly parts: number;
};
export type Output = {
  readonly clampingSeconds: number;
  readonly totalSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    setupSeconds: { type: "number", minimum: 0 },
    clampSecondsPerPart: { type: "number", minimum: 0 },
    parts: { type: "integer", minimum: 0 },
  },
  required: ["setupSeconds", "clampSecondsPerPart", "parts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clampingSeconds: { type: "number" },
    totalSeconds: { type: "number" },
  },
  required: ["clampingSeconds", "totalSeconds"],
} as const;
/** Budget one explicit fixture setup plus uniform per-part clamping time without assuming task overlap. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { setupSeconds, clampSecondsPerPart, parts } = request;
  const compute = (): Output => {
    H.domain(setupSeconds >= 0 && clampSecondsPerPart >= 0, "setupSeconds");
    (H.domain(
      Number.isSafeInteger(parts) &&
        parts >= 0 &&
        parts <= Number.MAX_SAFE_INTEGER,
      "parts",
    ),
      parts);
    return {
      clampingSeconds: clampSecondsPerPart * parts,
      totalSeconds: setupSeconds + clampSecondsPerPart * parts,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { setupSeconds: 120, clampSecondsPerPart: 5, parts: 20 },
  output: { clampingSeconds: 100, totalSeconds: 220 },
} satisfies ToolExample<Input, Output>;
export const fixtureSetupClampingTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "industrial-engineering",
        "industrial engineering",
        "engineering",
      ],
      keywords: ["industrial engineering", "engineering"],
    },
    id: "industrial-engineering/fixture-setup-clamping-time",
    title: "Fixture Setup Clamping Time",
    description:
      "Budget one explicit fixture setup plus uniform per-part clamping time without assuming task overlap.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        setupSeconds: { type: "number", minimum: 0 },
        clampSecondsPerPart: { type: "number", minimum: 0 },
        parts: { type: "integer", minimum: 0 },
      },
      required: ["setupSeconds", "clampSecondsPerPart", "parts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clampingSeconds: { type: "number" },
        totalSeconds: { type: "number" },
      },
      required: ["clampingSeconds", "totalSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "setupSeconds",
          label: "Setup Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clampSecondsPerPart",
          label: "Clamp Seconds Per Part",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "parts",
          label: "Parts",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "clampingSeconds",
          label: "Clamping Seconds",
          valueType: { type: "number" },
        },
        {
          id: "totalSeconds",
          label: "Total Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fixtureSetupClampingTimeTool.execute;
export default fixtureSetupClampingTimeTool;
