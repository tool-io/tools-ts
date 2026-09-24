import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly alive: number;
  readonly dead: number;
  readonly unknown: number;
  readonly includeUnknown: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly survivalShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alive: { type: "integer", minimum: 0 },
    dead: { type: "integer", minimum: 0 },
    unknown: { type: "integer", minimum: 0 },
    includeUnknown: { type: "boolean" },
  },
  required: ["alive", "dead", "unknown", "includeUnknown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    survivalShare: { type: "number" },
  },
  required: ["denominator", "survivalShare"],
} as const;
/** Calculate restoration survival unknown base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { alive, dead, unknown, includeUnknown } = request;
  const compute = (): Output => {
    H.integer(alive, 0);
    H.integer(dead, 0);
    H.integer(unknown, 0);
    H.domain(alive + dead > 0);
    return {
      denominator: alive + dead + (includeUnknown ? unknown : 0),
      survivalShare: alive / (alive + dead + (includeUnknown ? unknown : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { alive: 60, dead: 20, unknown: 20, includeUnknown: false },
  output: { denominator: 80, survivalShare: 0.75 },
} satisfies ToolExample<Input, Output>;
export const restorationSurvivalUnknownBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "conservation-biology/restoration-survival-unknown-base-flag",
    title: "Restoration Survival Unknown Base Flag Tool",
    description:
      "Calculate restoration survival unknown base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alive: { type: "integer", minimum: 0 },
        dead: { type: "integer", minimum: 0 },
        unknown: { type: "integer", minimum: 0 },
        includeUnknown: { type: "boolean" },
      },
      required: ["alive", "dead", "unknown", "includeUnknown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        survivalShare: { type: "number" },
      },
      required: ["denominator", "survivalShare"],
    },
    ports: {
      inputs: [
        {
          id: "alive",
          label: "Alive",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dead",
          label: "Dead",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unknown",
          label: "Unknown",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeUnknown",
          label: "Include Unknown",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "survivalShare",
          label: "Survival Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = restorationSurvivalUnknownBaseFlagTool.execute;
export default restorationSurvivalUnknownBaseFlagTool;
