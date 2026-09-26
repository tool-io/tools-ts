import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly catchCount: number;
  readonly traps: number;
  readonly nights: number;
  readonly functioningFraction: number;
};
export type Output = {
  readonly trapNights: number;
  readonly catchPerTrapNight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    catchCount: { type: "integer", minimum: 0 },
    traps: { type: "integer", minimum: 1 },
    nights: { type: "number", exclusiveMinimum: 0 },
    functioningFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["catchCount", "traps", "nights", "functioningFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trapNights: { type: "number" },
    catchPerTrapNight: { type: "number" },
  },
  required: ["trapNights", "catchPerTrapNight"],
} as const;
/** Calculate trap catch per trap night term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { catchCount, traps, nights, functioningFraction } = request;
  const compute = (): Output => {
    H.integer(catchCount, 0);
    H.integer(traps, 1);
    H.positive(nights);
    H.domain(functioningFraction > 0 && functioningFraction <= 1);
    return {
      trapNights: traps * nights * functioningFraction,
      catchPerTrapNight: catchCount / (traps * nights * functioningFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { catchCount: 120, traps: 10, nights: 3, functioningFraction: 0.8 },
  output: { trapNights: 24, catchPerTrapNight: 5 },
} satisfies ToolExample<Input, Output>;
export const trapCatchPerTrapNightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/trap-catch-per-trap-night-term",
    title: "Trap Catch Per Trap Night Term Tool",
    description:
      "Calculate trap catch per trap night term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        catchCount: { type: "integer", minimum: 0 },
        traps: { type: "integer", minimum: 1 },
        nights: { type: "number", exclusiveMinimum: 0 },
        functioningFraction: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
      },
      required: ["catchCount", "traps", "nights", "functioningFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trapNights: { type: "number" },
        catchPerTrapNight: { type: "number" },
      },
      required: ["trapNights", "catchPerTrapNight"],
    },
    ports: {
      inputs: [
        {
          id: "catchCount",
          label: "Catch Count",
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
          id: "nights",
          label: "Nights",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "functioningFraction",
          label: "Functioning Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "trapNights",
          label: "Trap Nights",
          valueType: { type: "number" },
        },
        {
          id: "catchPerTrapNight",
          label: "Catch Per Trap Night",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trapCatchPerTrapNightTermTool.execute;
export default trapCatchPerTrapNightTermTool;
