import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lower: number;
  readonly upper: number;
  readonly suppliedNull: number;
  readonly includeLower: boolean;
  readonly includeUpper: boolean;
};
export type Output = {
  readonly containsNull: boolean;
  readonly touchesNull: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    suppliedNull: { type: "number" },
    includeLower: { type: "boolean" },
    includeUpper: { type: "boolean" },
  },
  required: ["lower", "upper", "suppliedNull", "includeLower", "includeUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    containsNull: { type: "boolean" },
    touchesNull: { type: "boolean" },
  },
  required: ["containsNull", "touchesNull"],
} as const;
/** Inspect a supplied evidence interval and null convention without asserting efficacy or clinical significance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lower, upper, suppliedNull, includeLower, includeUpper } = request;
  const compute = (): Output => {
    H.domain(lower <= upper);
    return {
      containsNull:
        (includeLower ? suppliedNull >= lower : suppliedNull > lower) &&
        (includeUpper ? suppliedNull <= upper : suppliedNull < upper),
      touchesNull: suppliedNull === lower || suppliedNull === upper,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lower: -1,
    upper: 2,
    suppliedNull: 0,
    includeLower: true,
    includeUpper: true,
  },
  output: { containsNull: true, touchesNull: false },
} satisfies ToolExample<Input, Output>;
export const evidenceNullCrossingTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chiropractic/evidence-null-crossing-token",
    title: "Evidence Null Crossing Token Tool",
    description:
      "Inspect a supplied evidence interval and null convention without asserting efficacy or clinical significance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        suppliedNull: { type: "number" },
        includeLower: { type: "boolean" },
        includeUpper: { type: "boolean" },
      },
      required: [
        "lower",
        "upper",
        "suppliedNull",
        "includeLower",
        "includeUpper",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        containsNull: { type: "boolean" },
        touchesNull: { type: "boolean" },
      },
      required: ["containsNull", "touchesNull"],
    },
    ports: {
      inputs: [
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedNull",
          label: "Supplied Null",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeLower",
          label: "Include Lower",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeUpper",
          label: "Include Upper",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "containsNull",
          label: "Contains Null",
          valueType: { type: "boolean" },
        },
        {
          id: "touchesNull",
          label: "Touches Null",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = evidenceNullCrossingTokenTool.execute;
export default evidenceNullCrossingTokenTool;
