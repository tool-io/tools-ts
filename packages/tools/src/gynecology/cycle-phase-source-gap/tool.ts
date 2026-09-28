import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPhaseDay: number;
  readonly secondPhaseDay: number;
  readonly firstOriginDay: number;
  readonly secondOriginDay: number;
  readonly suppliedCycleLength: number;
};
export type Output = {
  readonly absoluteFirstDecimal: string;
  readonly absoluteSecondDecimal: string;
  readonly signedDifferenceDecimal: string;
  readonly sameModuloPhase: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPhaseDay: { type: "integer" },
    secondPhaseDay: { type: "integer" },
    firstOriginDay: { type: "integer" },
    secondOriginDay: { type: "integer" },
    suppliedCycleLength: { type: "integer", minimum: 1 },
  },
  required: [
    "firstPhaseDay",
    "secondPhaseDay",
    "firstOriginDay",
    "secondOriginDay",
    "suppliedCycleLength",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteFirstDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    absoluteSecondDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    signedDifferenceDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    sameModuloPhase: { type: "boolean" },
  },
  required: [
    "absoluteFirstDecimal",
    "absoluteSecondDecimal",
    "signedDifferenceDecimal",
    "sameModuloPhase",
  ],
} as const;
/** Compare explicit research phase-day sources on a supplied fixed cycle without predicting physiology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstPhaseDay,
    secondPhaseDay,
    firstOriginDay,
    secondOriginDay,
    suppliedCycleLength,
  } = request;
  const compute = (): Output => {
    H.integer(suppliedCycleLength, 1);
    return (() => {
      const a = BigInt(firstPhaseDay) + BigInt(firstOriginDay),
        b = BigInt(secondPhaseDay) + BigInt(secondOriginDay),
        n = BigInt(suppliedCycleLength);
      return {
        absoluteFirstDecimal: a.toString(),
        absoluteSecondDecimal: b.toString(),
        signedDifferenceDecimal: (b - a).toString(),
        sameModuloPhase: (b - a) % n === 0n,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstPhaseDay: 2,
    secondPhaseDay: 3,
    firstOriginDay: 10,
    secondOriginDay: 9,
    suppliedCycleLength: 28,
  },
  output: {
    absoluteFirstDecimal: "12",
    absoluteSecondDecimal: "12",
    signedDifferenceDecimal: "0",
    sameModuloPhase: true,
  },
} satisfies ToolExample<Input, Output>;
export const cyclePhaseSourceGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "gynecology/cycle-phase-source-gap",
      title: "Cycle Phase Source Gap Tool",
      description:
        "Compare explicit research phase-day sources on a supplied fixed cycle without predicting physiology.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstPhaseDay: { type: "integer" },
          secondPhaseDay: { type: "integer" },
          firstOriginDay: { type: "integer" },
          secondOriginDay: { type: "integer" },
          suppliedCycleLength: { type: "integer", minimum: 1 },
        },
        required: [
          "firstPhaseDay",
          "secondPhaseDay",
          "firstOriginDay",
          "secondOriginDay",
          "suppliedCycleLength",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          absoluteFirstDecimal: {
            type: "string",
            maxLength: 8192,
            format: "integer-decimal",
          },
          absoluteSecondDecimal: {
            type: "string",
            maxLength: 8192,
            format: "integer-decimal",
          },
          signedDifferenceDecimal: {
            type: "string",
            maxLength: 8192,
            format: "integer-decimal",
          },
          sameModuloPhase: { type: "boolean" },
        },
        required: [
          "absoluteFirstDecimal",
          "absoluteSecondDecimal",
          "signedDifferenceDecimal",
          "sameModuloPhase",
        ],
      },
      ports: {
        inputs: [
          {
            id: "firstPhaseDay",
            label: "First Phase Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "secondPhaseDay",
            label: "Second Phase Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "firstOriginDay",
            label: "First Origin Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "secondOriginDay",
            label: "Second Origin Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "suppliedCycleLength",
            label: "Supplied Cycle Length",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "absoluteFirstDecimal",
            label: "Absolute First Decimal",
            valueType: { type: "string", format: "integer-decimal" },
          },
          {
            id: "absoluteSecondDecimal",
            label: "Absolute Second Decimal",
            valueType: { type: "string", format: "integer-decimal" },
          },
          {
            id: "signedDifferenceDecimal",
            label: "Signed Difference Decimal",
            valueType: { type: "string", format: "integer-decimal" },
          },
          {
            id: "sameModuloPhase",
            label: "Same Modulo Phase",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = cyclePhaseSourceGapTool.execute;
export default cyclePhaseSourceGapTool;
