import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly travel: number;
  readonly contact: number;
  readonly documentation: number;
  readonly sharedTravelFraction: number;
};
export type Output = {
  readonly allocatedTime: number;
  readonly contactShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    travel: { type: "number", minimum: 0 },
    contact: { type: "number", minimum: 0 },
    documentation: { type: "number", minimum: 0 },
    sharedTravelFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["travel", "contact", "documentation", "sharedTravelFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedTime: { type: "number" },
    contactShare: { type: "number" },
  },
  required: ["allocatedTime", "contactShare"],
} as const;
/** Calculate extension visit travel contact time share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { travel, contact, documentation, sharedTravelFraction } = request;
  const compute = (): Output => {
    H.domain(
      travel >= 0 &&
        contact >= 0 &&
        documentation >= 0 &&
        travel * sharedTravelFraction + contact + documentation > 0,
    );
    H.probability(sharedTravelFraction);
    return {
      allocatedTime: travel * sharedTravelFraction + contact + documentation,
      contactShare:
        contact / (travel * sharedTravelFraction + contact + documentation),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    travel: 60,
    contact: 30,
    documentation: 10,
    sharedTravelFraction: 0.5,
  },
  output: { allocatedTime: 70, contactShare: 0.42857142857142855 },
} satisfies ToolExample<Input, Output>;
export const extensionVisitTravelContactTimeShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-extension/extension-visit-travel-contact-time-share",
      title: "Extension Visit Travel Contact Time Share Tool",
      description:
        "Calculate extension visit travel contact time share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          travel: { type: "number", minimum: 0 },
          contact: { type: "number", minimum: 0 },
          documentation: { type: "number", minimum: 0 },
          sharedTravelFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "travel",
          "contact",
          "documentation",
          "sharedTravelFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          allocatedTime: { type: "number" },
          contactShare: { type: "number" },
        },
        required: ["allocatedTime", "contactShare"],
      },
      ports: {
        inputs: [
          {
            id: "travel",
            label: "Travel",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "contact",
            label: "Contact",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "documentation",
            label: "Documentation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sharedTravelFraction",
            label: "Shared Travel Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
        ],
        outputs: [
          {
            id: "allocatedTime",
            label: "Allocated Time",
            valueType: { type: "number" },
          },
          {
            id: "contactShare",
            label: "Contact Share",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = extensionVisitTravelContactTimeShareTool.execute;
export default extensionVisitTravelContactTimeShareTool;
