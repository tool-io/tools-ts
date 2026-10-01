import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packages: number;
  readonly perPackage: number;
  readonly loose: number;
  readonly issued: number;
  readonly returned: number;
  readonly damaged: number;
};
export type Output = {
  readonly opening: number;
  readonly closing: number;
  readonly usable: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packages: { type: "integer", minimum: 0 },
    perPackage: { type: "integer", minimum: 1 },
    loose: { type: "integer", minimum: 0 },
    issued: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    damaged: { type: "integer", minimum: 0 },
  },
  required: [
    "packages",
    "perPackage",
    "loose",
    "issued",
    "returned",
    "damaged",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "integer" },
    closing: { type: "integer" },
    usable: { type: "integer" },
  },
  required: ["opening", "closing", "usable"],
} as const;
/** Calculate orthodontic device package count balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packages, perPackage, loose, issued, returned, damaged } = request;
  const compute = (): Output => {
    H.integer(packages, 0);
    H.integer(perPackage, 1);
    H.integer(loose, 0);
    H.integer(issued, 0);
    H.integer(returned, 0);
    H.integer(damaged, 0);
    H.domain(packages * perPackage + loose - issued + returned >= damaged);
    return {
      opening: packages * perPackage + loose,
      closing: packages * perPackage + loose - issued + returned,
      usable: packages * perPackage + loose - issued + returned - damaged,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    packages: 3,
    perPackage: 10,
    loose: 2,
    issued: 12,
    returned: 1,
    damaged: 2,
  },
  output: { opening: 32, closing: 21, usable: 19 },
} satisfies ToolExample<Input, Output>;
export const orthodonticDevicePackageCountBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "orthodontics/orthodontic-device-package-count-balance",
      title: "Orthodontic Device Package Count Balance Tool",
      description:
        "Calculate orthodontic device package count balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          packages: { type: "integer", minimum: 0 },
          perPackage: { type: "integer", minimum: 1 },
          loose: { type: "integer", minimum: 0 },
          issued: { type: "integer", minimum: 0 },
          returned: { type: "integer", minimum: 0 },
          damaged: { type: "integer", minimum: 0 },
        },
        required: [
          "packages",
          "perPackage",
          "loose",
          "issued",
          "returned",
          "damaged",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opening: { type: "integer" },
          closing: { type: "integer" },
          usable: { type: "integer" },
        },
        required: ["opening", "closing", "usable"],
      },
      ports: {
        inputs: [
          {
            id: "packages",
            label: "Packages",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "perPackage",
            label: "Per Package",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "loose",
            label: "Loose",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "issued",
            label: "Issued",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returned",
            label: "Returned",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "damaged",
            label: "Damaged",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "opening", label: "Opening", valueType: { type: "integer" } },
          { id: "closing", label: "Closing", valueType: { type: "integer" } },
          { id: "usable", label: "Usable", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = orthodonticDevicePackageCountBalanceTool.execute;
export default orthodonticDevicePackageCountBalanceTool;
