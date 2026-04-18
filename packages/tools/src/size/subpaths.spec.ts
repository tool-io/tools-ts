import { describe, expect, it } from "vitest";
import type { ToolDefinition } from "../core/definition.js";
import { measurementSizeConfigs } from "./measurementConfigs.js";

const modules = (
  import.meta as unknown as {
    glob<T>(pattern: string, options: { eager: true }): Record<string, T>;
  }
).glob<{
  default: ToolDefinition<unknown, unknown>;
}>("./*/tool.ts", { eager: true });

describe("size tool subpaths", () => {
  it.each(Object.entries(measurementSizeConfigs))(
    "exposes size/%s as an independently executable tool",
    (slug, config) => {
      const module = modules[`./${slug}/tool.ts`];
      expect(module, `Missing size/${slug}/tool.ts`).toBeDefined();
      expect(module?.default.id).toBe(`size/${slug}`);

      const values = Object.fromEntries(
        Object.entries(config.fields).map(([field, definition]) => [
          field,
          definition.defaultCm,
        ]),
      );
      expect(module?.default.execute({ unit: "cm", values }).ok).toBe(true);
    },
  );
});
