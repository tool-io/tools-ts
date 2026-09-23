import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly germinated: number;
  readonly observedUngerminated: number;
  readonly lost: number;
  readonly totalSown: number;
  readonly excludeLost: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly germinationFraction: number;
  readonly lostFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    germinated: { type: "integer", minimum: 0 },
    observedUngerminated: { type: "integer", minimum: 0 },
    lost: { type: "integer", minimum: 0 },
    totalSown: { type: "integer", minimum: 1 },
    excludeLost: { type: "boolean" },
  },
  required: [
    "germinated",
    "observedUngerminated",
    "lost",
    "totalSown",
    "excludeLost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    germinationFraction: { type: "number" },
    lostFraction: { type: "number" },
  },
  required: ["denominator", "germinationFraction", "lostFraction"],
} as const;
/** Calculate seed germination censored denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { germinated, observedUngerminated, lost, totalSown, excludeLost } =
    request;
  const compute = (): Output => {
    H.integer(totalSown, 1);
    H.integer(germinated, 0);
    H.integer(observedUngerminated, 0);
    H.integer(lost, 0);
    H.domain(
      germinated + observedUngerminated + lost === totalSown &&
        germinated + observedUngerminated > 0,
    );
    return {
      denominator: excludeLost ? germinated + observedUngerminated : totalSown,
      germinationFraction:
        germinated /
        (excludeLost ? germinated + observedUngerminated : totalSown),
      lostFraction: lost / totalSown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    germinated: 60,
    observedUngerminated: 20,
    lost: 20,
    totalSown: 100,
    excludeLost: true,
  },
  output: { denominator: 80, germinationFraction: 0.75, lostFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const seedGerminationCensoredDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/seed-germination-censored-denominator",
    title: "Seed Germination Censored Denominator Tool",
    description:
      "Calculate seed germination censored denominator from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        germinated: { type: "integer", minimum: 0 },
        observedUngerminated: { type: "integer", minimum: 0 },
        lost: { type: "integer", minimum: 0 },
        totalSown: { type: "integer", minimum: 1 },
        excludeLost: { type: "boolean" },
      },
      required: [
        "germinated",
        "observedUngerminated",
        "lost",
        "totalSown",
        "excludeLost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        germinationFraction: { type: "number" },
        lostFraction: { type: "number" },
      },
      required: ["denominator", "germinationFraction", "lostFraction"],
    },
    ports: {
      inputs: [
        {
          id: "germinated",
          label: "Germinated",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observedUngerminated",
          label: "Observed Ungerminated",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lost",
          label: "Lost",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalSown",
          label: "Total Sown",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludeLost",
          label: "Exclude Lost",
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
          id: "germinationFraction",
          label: "Germination Fraction",
          valueType: { type: "number" },
        },
        {
          id: "lostFraction",
          label: "Lost Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seedGerminationCensoredDenominatorTool.execute;
export default seedGerminationCensoredDenominatorTool;
