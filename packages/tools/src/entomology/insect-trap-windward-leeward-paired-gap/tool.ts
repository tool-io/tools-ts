import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly windwardCatch: number;
  readonly leewardCatch: number;
  readonly windwardHours: number;
  readonly leewardHours: number;
};
export type Output = {
  readonly windwardRate: number;
  readonly leewardRate: number;
  readonly rateDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windwardCatch: { type: "integer", minimum: 0 },
    leewardCatch: { type: "integer", minimum: 0 },
    windwardHours: { type: "number", exclusiveMinimum: 0 },
    leewardHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["windwardCatch", "leewardCatch", "windwardHours", "leewardHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windwardRate: { type: "number" },
    leewardRate: { type: "number" },
    rateDifference: { type: "number" },
  },
  required: ["windwardRate", "leewardRate", "rateDifference"],
} as const;
/** Calculate insect trap windward leeward paired gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { windwardCatch, leewardCatch, windwardHours, leewardHours } = request;
  const compute = (): Output => {
    H.integer(windwardCatch, 0);
    H.integer(leewardCatch, 0);
    H.positive(windwardHours);
    H.positive(leewardHours);
    return {
      windwardRate: windwardCatch / windwardHours,
      leewardRate: leewardCatch / leewardHours,
      rateDifference:
        windwardCatch / windwardHours - leewardCatch / leewardHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    windwardCatch: 30,
    leewardCatch: 20,
    windwardHours: 10,
    leewardHours: 10,
  },
  output: { windwardRate: 3, leewardRate: 2, rateDifference: 1 },
} satisfies ToolExample<Input, Output>;
export const insectTrapWindwardLeewardPairedGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/insect-trap-windward-leeward-paired-gap",
    title: "Insect Trap Windward Leeward Paired Gap Tool",
    description:
      "Calculate insect trap windward leeward paired gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windwardCatch: { type: "integer", minimum: 0 },
        leewardCatch: { type: "integer", minimum: 0 },
        windwardHours: { type: "number", exclusiveMinimum: 0 },
        leewardHours: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "windwardCatch",
        "leewardCatch",
        "windwardHours",
        "leewardHours",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windwardRate: { type: "number" },
        leewardRate: { type: "number" },
        rateDifference: { type: "number" },
      },
      required: ["windwardRate", "leewardRate", "rateDifference"],
    },
    ports: {
      inputs: [
        {
          id: "windwardCatch",
          label: "Windward Catch",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "leewardCatch",
          label: "Leeward Catch",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "windwardHours",
          label: "Windward Hours",
          required: true,
          valueType: { type: "number", unit: "h" },
        },
        {
          id: "leewardHours",
          label: "Leeward Hours",
          required: true,
          valueType: { type: "number", unit: "h" },
        },
      ],
      outputs: [
        {
          id: "windwardRate",
          label: "Windward Rate",
          valueType: { type: "number" },
        },
        {
          id: "leewardRate",
          label: "Leeward Rate",
          valueType: { type: "number" },
        },
        {
          id: "rateDifference",
          label: "Rate Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insectTrapWindwardLeewardPairedGapTool.execute;
export default insectTrapWindwardLeewardPairedGapTool;
