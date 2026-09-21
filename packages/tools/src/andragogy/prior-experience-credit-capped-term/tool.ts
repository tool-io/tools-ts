import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly experienceHours: number;
  readonly creditPerHour: number;
  readonly evidenceFraction: number;
  readonly cap: number;
};
export type Output = {
  readonly uncapped: number;
  readonly recognized: number;
  readonly excluded: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    experienceHours: { type: "number", minimum: 0 },
    creditPerHour: { type: "number", minimum: 0 },
    evidenceFraction: { type: "number", minimum: 0, maximum: 1 },
    cap: { type: "number", minimum: 0 },
  },
  required: ["experienceHours", "creditPerHour", "evidenceFraction", "cap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncapped: { type: "number" },
    recognized: { type: "number" },
    excluded: { type: "number" },
  },
  required: ["uncapped", "recognized", "excluded"],
} as const;
/** Calculate prior experience credit capped term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { experienceHours, creditPerHour, evidenceFraction, cap } = request;
  const compute = (): Output => {
    H.domain(experienceHours >= 0 && creditPerHour >= 0 && cap >= 0);
    H.probability(evidenceFraction);
    return {
      uncapped: experienceHours * creditPerHour * evidenceFraction,
      recognized: Math.min(
        cap,
        experienceHours * creditPerHour * evidenceFraction,
      ),
      excluded: Math.max(
        0,
        experienceHours * creditPerHour * evidenceFraction - cap,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    experienceHours: 100,
    creditPerHour: 0.1,
    evidenceFraction: 0.8,
    cap: 6,
  },
  output: { uncapped: 8, recognized: 6, excluded: 2 },
} satisfies ToolExample<Input, Output>;
export const priorExperienceCreditCappedTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/prior-experience-credit-capped-term",
    title: "Prior Experience Credit Capped Term Tool",
    description:
      "Calculate prior experience credit capped term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        experienceHours: { type: "number", minimum: 0 },
        creditPerHour: { type: "number", minimum: 0 },
        evidenceFraction: { type: "number", minimum: 0, maximum: 1 },
        cap: { type: "number", minimum: 0 },
      },
      required: ["experienceHours", "creditPerHour", "evidenceFraction", "cap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncapped: { type: "number" },
        recognized: { type: "number" },
        excluded: { type: "number" },
      },
      required: ["uncapped", "recognized", "excluded"],
    },
    ports: {
      inputs: [
        {
          id: "experienceHours",
          label: "Experience Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditPerHour",
          label: "Credit Per Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "evidenceFraction",
          label: "Evidence Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cap",
          label: "Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "uncapped", label: "Uncapped", valueType: { type: "number" } },
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "number" },
        },
        { id: "excluded", label: "Excluded", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = priorExperienceCreditCappedTermTool.execute;
export default priorExperienceCreditCappedTermTool;
