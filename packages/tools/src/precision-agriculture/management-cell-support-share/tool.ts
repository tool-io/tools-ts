import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellAreas: readonly number[];
  readonly boundaryValid: readonly boolean[];
  readonly sourceCurrent: readonly boolean[];
  readonly observationPresent: readonly boolean[];
};
export type Output = {
  readonly area: number;
  readonly supportedArea: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellAreas: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    boundaryValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sourceCurrent: { type: "array", maxItems: 256, items: { type: "boolean" } },
    observationPresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "cellAreas",
    "boundaryValid",
    "sourceCurrent",
    "observationPresent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number" },
    supportedArea: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["area", "supportedArea", "share", "defined"],
} as const;
/** Calculate management cell support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellAreas, boundaryValid, sourceCurrent, observationPresent } =
    request;
  const compute = (): Output => {
    H.sameLength(cellAreas, boundaryValid);
    H.sameLength(cellAreas, sourceCurrent);
    H.sameLength(cellAreas, observationPresent);
    H.domain(cellAreas.every((x) => x >= 0));
    return (() => {
      const area = cellAreas.reduce((a, b) => a + b, 0),
        supportedArea = cellAreas.reduce(
          (s, x, i) =>
            s +
            (boundaryValid[i] && sourceCurrent[i] && observationPresent[i]
              ? x
              : 0),
          0,
        );
      return {
        area,
        supportedArea,
        share: area > 0 ? supportedArea / area : 0,
        defined: area > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cellAreas: [2, 3, 5],
    boundaryValid: [true, true, true],
    sourceCurrent: [true, true, false],
    observationPresent: [true, false, true],
  },
  output: { area: 10, supportedArea: 2, share: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const managementCellSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/management-cell-support-share",
    title: "Management Cell Support Share Tool",
    description:
      "Calculate management cell support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        boundaryValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        sourceCurrent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        observationPresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "cellAreas",
        "boundaryValid",
        "sourceCurrent",
        "observationPresent",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number" },
        supportedArea: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["area", "supportedArea", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "cellAreas",
          label: "Cell Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "boundaryValid",
          label: "Boundary Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sourceCurrent",
          label: "Source Current",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "observationPresent",
          label: "Observation Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "area", label: "Area", valueType: { type: "number" } },
        {
          id: "supportedArea",
          label: "Supported Area",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = managementCellSupportShareTool.execute;
export default managementCellSupportShareTool;
