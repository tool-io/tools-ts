import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localSector: number;
  readonly localTotal: number;
  readonly referenceSector: number;
  readonly referenceTotal: number;
};
export type Output = {
  readonly localShare: number;
  readonly referenceShare: number;
  readonly quotient: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localSector: { type: "number", minimum: 0 },
    localTotal: { type: "number", exclusiveMinimum: 0 },
    referenceSector: { type: "number", exclusiveMinimum: 0 },
    referenceTotal: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["localSector", "localTotal", "referenceSector", "referenceTotal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localShare: { type: "number" },
    referenceShare: { type: "number" },
    quotient: { type: "number" },
  },
  required: ["localShare", "referenceShare", "quotient"],
} as const;
/** Calculate location quotient one employment cell from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localSector, localTotal, referenceSector, referenceTotal } = request;
  const compute = (): Output => {
    H.positive(localTotal);
    H.positive(referenceTotal);
    H.positive(referenceSector);
    H.domain(
      localSector >= 0 &&
        localSector <= localTotal &&
        referenceSector <= referenceTotal,
    );
    return {
      localShare: localSector / localTotal,
      referenceShare: referenceSector / referenceTotal,
      quotient: (localSector * referenceTotal) / (localTotal * referenceSector),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    localSector: 40,
    localTotal: 200,
    referenceSector: 100,
    referenceTotal: 1000,
  },
  output: { localShare: 0.2, referenceShare: 0.1, quotient: 2 },
} satisfies ToolExample<Input, Output>;
export const locationQuotientOneEmploymentCellTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/location-quotient-one-employment-cell",
    title: "Location Quotient One Employment Cell Tool",
    description:
      "Calculate location quotient one employment cell from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localSector: { type: "number", minimum: 0 },
        localTotal: { type: "number", exclusiveMinimum: 0 },
        referenceSector: { type: "number", exclusiveMinimum: 0 },
        referenceTotal: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "localSector",
        "localTotal",
        "referenceSector",
        "referenceTotal",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localShare: { type: "number" },
        referenceShare: { type: "number" },
        quotient: { type: "number" },
      },
      required: ["localShare", "referenceShare", "quotient"],
    },
    ports: {
      inputs: [
        {
          id: "localSector",
          label: "Local Sector",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "localTotal",
          label: "Local Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceSector",
          label: "Reference Sector",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceTotal",
          label: "Reference Total",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "localShare",
          label: "Local Share",
          valueType: { type: "number" },
        },
        {
          id: "referenceShare",
          label: "Reference Share",
          valueType: { type: "number" },
        },
        { id: "quotient", label: "Quotient", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = locationQuotientOneEmploymentCellTool.execute;
export default locationQuotientOneEmploymentCellTool;
