import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seeds: number;
  readonly traps: number;
  readonly trapArea: number;
  readonly exposedDays: number;
  readonly operationalFraction: number;
};
export type Output = {
  readonly areaDays: number;
  readonly densityPerAreaDay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seeds: { type: "integer", minimum: 0 },
    traps: { type: "integer", minimum: 1 },
    trapArea: { type: "number", exclusiveMinimum: 0 },
    exposedDays: { type: "number", exclusiveMinimum: 0 },
    operationalFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: [
    "seeds",
    "traps",
    "trapArea",
    "exposedDays",
    "operationalFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaDays: { type: "number" },
    densityPerAreaDay: { type: "number" },
  },
  required: ["areaDays", "densityPerAreaDay"],
} as const;
/** Calculate seedrain density trap area time factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seeds, traps, trapArea, exposedDays, operationalFraction } = request;
  const compute = (): Output => {
    H.integer(seeds, 0);
    H.integer(traps, 1);
    H.positive(trapArea);
    H.positive(exposedDays);
    H.domain(operationalFraction > 0 && operationalFraction <= 1);
    return {
      areaDays: traps * trapArea * exposedDays * operationalFraction,
      densityPerAreaDay:
        seeds / (traps * trapArea * exposedDays * operationalFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    seeds: 120,
    traps: 10,
    trapArea: 0.2,
    exposedDays: 30,
    operationalFraction: 0.8,
  },
  output: { areaDays: 48, densityPerAreaDay: 2.5 },
} satisfies ToolExample<Input, Output>;
export const seedrainDensityTrapAreaTimeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/seedrain-density-trap-area-time-factor",
    title: "Seedrain Density Trap Area Time Factor Tool",
    description:
      "Calculate seedrain density trap area time factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seeds: { type: "integer", minimum: 0 },
        traps: { type: "integer", minimum: 1 },
        trapArea: { type: "number", exclusiveMinimum: 0 },
        exposedDays: { type: "number", exclusiveMinimum: 0 },
        operationalFraction: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
      },
      required: [
        "seeds",
        "traps",
        "trapArea",
        "exposedDays",
        "operationalFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaDays: { type: "number" },
        densityPerAreaDay: { type: "number" },
      },
      required: ["areaDays", "densityPerAreaDay"],
    },
    ports: {
      inputs: [
        {
          id: "seeds",
          label: "Seeds",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "traps",
          label: "Traps",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "trapArea",
          label: "Trap Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exposedDays",
          label: "Exposed Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "operationalFraction",
          label: "Operational Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "areaDays", label: "Area Days", valueType: { type: "number" } },
        {
          id: "densityPerAreaDay",
          label: "Density Per Area Day",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seedrainDensityTrapAreaTimeFactorTool.execute;
export default seedrainDensityTrapAreaTimeFactorTool;
