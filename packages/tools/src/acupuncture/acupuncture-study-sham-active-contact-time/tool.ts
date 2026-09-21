import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activeContact: number;
  readonly activeWaiting: number;
  readonly shamContact: number;
  readonly shamWaiting: number;
};
export type Output = {
  readonly contactGap: number;
  readonly totalTimeGap: number;
  readonly contactRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeContact: { type: "number", minimum: 0 },
    activeWaiting: { type: "number", minimum: 0 },
    shamContact: { type: "number", exclusiveMinimum: 0 },
    shamWaiting: { type: "number", minimum: 0 },
  },
  required: ["activeContact", "activeWaiting", "shamContact", "shamWaiting"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactGap: { type: "number" },
    totalTimeGap: { type: "number" },
    contactRatio: { type: "number" },
  },
  required: ["contactGap", "totalTimeGap", "contactRatio"],
} as const;
/** Calculate acupuncture study sham active contact time from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activeContact, activeWaiting, shamContact, shamWaiting } = request;
  const compute = (): Output => {
    H.domain(activeContact >= 0 && activeWaiting >= 0 && shamWaiting >= 0);
    H.positive(shamContact);
    return {
      contactGap: activeContact - shamContact,
      totalTimeGap: activeContact + activeWaiting - shamContact - shamWaiting,
      contactRatio: activeContact / shamContact,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activeContact: 30,
    activeWaiting: 10,
    shamContact: 20,
    shamWaiting: 15,
  },
  output: { contactGap: 10, totalTimeGap: 5, contactRatio: 1.5 },
} satisfies ToolExample<Input, Output>;
export const acupunctureStudyShamActiveContactTimeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "acupuncture/acupuncture-study-sham-active-contact-time",
      title: "Acupuncture Study Sham Active Contact Time Tool",
      description:
        "Calculate acupuncture study sham active contact time from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activeContact: { type: "number", minimum: 0 },
          activeWaiting: { type: "number", minimum: 0 },
          shamContact: { type: "number", exclusiveMinimum: 0 },
          shamWaiting: { type: "number", minimum: 0 },
        },
        required: [
          "activeContact",
          "activeWaiting",
          "shamContact",
          "shamWaiting",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contactGap: { type: "number" },
          totalTimeGap: { type: "number" },
          contactRatio: { type: "number" },
        },
        required: ["contactGap", "totalTimeGap", "contactRatio"],
      },
      ports: {
        inputs: [
          {
            id: "activeContact",
            label: "Active Contact",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "activeWaiting",
            label: "Active Waiting",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "shamContact",
            label: "Sham Contact",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "shamWaiting",
            label: "Sham Waiting",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "contactGap",
            label: "Contact Gap",
            valueType: { type: "number" },
          },
          {
            id: "totalTimeGap",
            label: "Total Time Gap",
            valueType: { type: "number" },
          },
          {
            id: "contactRatio",
            label: "Contact Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = acupunctureStudyShamActiveContactTimeTool.execute;
export default acupunctureStudyShamActiveContactTimeTool;
