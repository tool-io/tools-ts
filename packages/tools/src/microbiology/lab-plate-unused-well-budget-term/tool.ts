import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rows: number;
  readonly columns: number;
  readonly controls: number;
  readonly standards: number;
  readonly samples: number;
  readonly replicates: number;
};
export type Output = {
  readonly totalWells: number;
  readonly reservedWells: number;
  readonly requiredSampleWells: number;
  readonly remaining: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: { type: "integer", minimum: 1 },
    columns: { type: "integer", minimum: 1 },
    controls: { type: "integer", minimum: 0 },
    standards: { type: "integer", minimum: 0 },
    samples: { type: "integer", minimum: 0 },
    replicates: { type: "integer", minimum: 1 },
  },
  required: [
    "rows",
    "columns",
    "controls",
    "standards",
    "samples",
    "replicates",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalWells: { type: "integer" },
    reservedWells: { type: "integer" },
    requiredSampleWells: { type: "integer" },
    remaining: { type: "integer" },
    fits: { type: "boolean" },
  },
  required: [
    "totalWells",
    "reservedWells",
    "requiredSampleWells",
    "remaining",
    "fits",
  ],
} as const;
/** Plate-capacity arithmetic from explicit counts, without an experimental assay layout recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rows, columns, controls, standards, samples, replicates } = request;
  const compute = (): Output => {
    H.integer(rows, 1);
    H.integer(columns, 1);
    H.integer(controls, 0);
    H.integer(standards, 0);
    H.integer(samples, 0);
    H.integer(replicates, 1);
    return {
      totalWells: rows * columns,
      reservedWells: controls + standards,
      requiredSampleWells: samples * replicates,
      remaining: rows * columns - controls - standards - samples * replicates,
      fits: controls + standards + samples * replicates <= rows * columns,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rows: 8,
    columns: 12,
    controls: 8,
    standards: 16,
    samples: 20,
    replicates: 3,
  },
  output: {
    totalWells: 96,
    reservedWells: 24,
    requiredSampleWells: 60,
    remaining: 12,
    fits: true,
  },
} satisfies ToolExample<Input, Output>;
export const labPlateUnusedWellBudgetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microbiology/lab-plate-unused-well-budget-term",
    title: "Lab Plate Unused Well Budget Term Tool",
    description:
      "Plate-capacity arithmetic from explicit counts, without an experimental assay layout recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rows: { type: "integer", minimum: 1 },
        columns: { type: "integer", minimum: 1 },
        controls: { type: "integer", minimum: 0 },
        standards: { type: "integer", minimum: 0 },
        samples: { type: "integer", minimum: 0 },
        replicates: { type: "integer", minimum: 1 },
      },
      required: [
        "rows",
        "columns",
        "controls",
        "standards",
        "samples",
        "replicates",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalWells: { type: "integer" },
        reservedWells: { type: "integer" },
        requiredSampleWells: { type: "integer" },
        remaining: { type: "integer" },
        fits: { type: "boolean" },
      },
      required: [
        "totalWells",
        "reservedWells",
        "requiredSampleWells",
        "remaining",
        "fits",
      ],
    },
    ports: {
      inputs: [
        {
          id: "rows",
          label: "Rows",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "columns",
          label: "Columns",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "controls",
          label: "Controls",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "standards",
          label: "Standards",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "samples",
          label: "Samples",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "replicates",
          label: "Replicates",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalWells",
          label: "Total Wells",
          valueType: { type: "integer" },
        },
        {
          id: "reservedWells",
          label: "Reserved Wells",
          valueType: { type: "integer" },
        },
        {
          id: "requiredSampleWells",
          label: "Required Sample Wells",
          valueType: { type: "integer" },
        },
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = labPlateUnusedWellBudgetTermTool.execute;
export default labPlateUnusedWellBudgetTermTool;
