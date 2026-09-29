import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fullNights: number;
  readonly partialHours: readonly number[];
  readonly suppliedHoursPerNight: number;
};
export type Output = { readonly equivalentNights: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullNights: { type: "integer", minimum: 0 },
    partialHours: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedHoursPerNight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["fullNights", "partialHours", "suppliedHoursPerNight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equivalentNights: { type: "number" } },
  required: ["equivalentNights"],
} as const;
/** Calculate trap night partial effort term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fullNights, partialHours, suppliedHoursPerNight } = request;
  const compute = (): Output => {
    H.integer(fullNights, 0);
    H.positive(suppliedHoursPerNight);
    H.domain(partialHours.every((x) => x >= 0 && x <= suppliedHoursPerNight));
    return {
      equivalentNights:
        fullNights +
        partialHours.reduce((a, b) => a + b, 0) / suppliedHoursPerNight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fullNights: 3, partialHours: [4, 2], suppliedHoursPerNight: 12 },
  output: { equivalentNights: 3.5 },
} satisfies ToolExample<Input, Output>;
export const trapNightPartialEffortTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/trap-night-partial-effort-term",
    title: "Trap Night Partial Effort Term Tool",
    description:
      "Calculate trap night partial effort term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullNights: { type: "integer", minimum: 0 },
        partialHours: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        suppliedHoursPerNight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["fullNights", "partialHours", "suppliedHoursPerNight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { equivalentNights: { type: "number" } },
      required: ["equivalentNights"],
    },
    ports: {
      inputs: [
        {
          id: "fullNights",
          label: "Full Nights",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "partialHours",
          label: "Partial Hours",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedHoursPerNight",
          label: "Supplied Hours Per Night",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equivalentNights",
          label: "Equivalent Nights",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trapNightPartialEffortTermTool.execute;
export default trapNightPartialEffortTermTool;
