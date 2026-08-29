import { createSimpleTool, simpleError } from "../core/simple.js";

export type DimensionalUnit = {
  readonly dimension: string;
  readonly factor: number;
};

export const createDimensionalConversionTool = (config: {
  readonly description: string;
  readonly id: string;
  readonly title: string;
  readonly units: Readonly<Record<string, DimensionalUnit>>;
}) =>
  createSimpleTool({
    id: config.id,
    title: config.title,
    description: config.description,
    inputs: [
      { id: "value", kind: "number", label: "Value" },
      {
        id: "fromUnit",
        kind: "string",
        label: "From unit",
        enum: Object.keys(config.units),
      },
      {
        id: "toUnit",
        kind: "string",
        label: "To unit",
        enum: Object.keys(config.units),
      },
    ],
    outputs: [
      { id: "value", kind: "number", label: "Converted value" },
      {
        id: "unit",
        kind: "string",
        label: "Unit",
        enum: Object.keys(config.units),
      },
    ],
    calculate: (input) => {
      const from = config.units[input.fromUnit as string];
      const to = config.units[input.toUnit as string];
      if (!from || !to || from.dimension !== to.dimension)
        simpleError("toUnit", "Choose units of the same physical dimension.");
      const sourceValue = input.value as number;
      let value = (sourceValue * from.factor) / to.factor;
      if ((!Number.isFinite(value) || value === 0) && sourceValue !== 0) {
        const ratio = from.factor / to.factor;
        const rescaled = sourceValue * ratio;
        value = Number.isFinite(rescaled)
          ? rescaled
          : Math.sign(sourceValue) *
            Math.exp(
              Math.log(Math.abs(sourceValue)) +
                Math.log(from.factor) -
                Math.log(to.factor),
            );
      }
      if (!Number.isFinite(value))
        simpleError("value", "Conversion overflows the finite number range.");
      return { unit: input.toUnit as string, value };
    },
  });
