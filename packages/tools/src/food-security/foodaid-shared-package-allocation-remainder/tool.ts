import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packages: number;
  readonly unitsPerPackage: number;
  readonly recipients: number;
  readonly reserveUnits: number;
};
export type Output = {
  readonly unitsEach: number;
  readonly remainderUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packages: { type: "integer", minimum: 0 },
    unitsPerPackage: { type: "integer", minimum: 1 },
    recipients: { type: "integer", minimum: 1 },
    reserveUnits: { type: "integer", minimum: 0 },
  },
  required: ["packages", "unitsPerPackage", "recipients", "reserveUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitsEach: { type: "integer" },
    remainderUnits: { type: "integer" },
  },
  required: ["unitsEach", "remainderUnits"],
} as const;
/** Calculate foodaid shared package allocation remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packages, unitsPerPackage, recipients, reserveUnits } = request;
  const compute = (): Output => {
    H.integer(packages, 0);
    H.integer(unitsPerPackage, 1);
    H.integer(recipients, 1);
    H.integer(reserveUnits, 0);
    H.domain(
      Number.isSafeInteger(packages * unitsPerPackage) &&
        reserveUnits <= packages * unitsPerPackage,
    );
    return {
      unitsEach: Math.floor(
        (packages * unitsPerPackage - reserveUnits) / recipients,
      ),
      remainderUnits: (packages * unitsPerPackage - reserveUnits) % recipients,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { packages: 10, unitsPerPackage: 12, recipients: 7, reserveUnits: 0 },
  output: { unitsEach: 17, remainderUnits: 1 },
} satisfies ToolExample<Input, Output>;
export const foodaidSharedPackageAllocationRemainderTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-security/foodaid-shared-package-allocation-remainder",
      title: "Foodaid Shared Package Allocation Remainder Tool",
      description:
        "Calculate foodaid shared package allocation remainder from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          packages: { type: "integer", minimum: 0 },
          unitsPerPackage: { type: "integer", minimum: 1 },
          recipients: { type: "integer", minimum: 1 },
          reserveUnits: { type: "integer", minimum: 0 },
        },
        required: ["packages", "unitsPerPackage", "recipients", "reserveUnits"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unitsEach: { type: "integer" },
          remainderUnits: { type: "integer" },
        },
        required: ["unitsEach", "remainderUnits"],
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
            id: "unitsPerPackage",
            label: "Units Per Package",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "recipients",
            label: "Recipients",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reserveUnits",
            label: "Reserve Units",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "unitsEach",
            label: "Units Each",
            valueType: { type: "integer" },
          },
          {
            id: "remainderUnits",
            label: "Remainder Units",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = foodaidSharedPackageAllocationRemainderTool.execute;
export default foodaidSharedPackageAllocationRemainderTool;
