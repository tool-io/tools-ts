import type { ToolExecutionContext, ToolProgress } from "./definition.js";

export type ToolExecutionControl = {
  /**
   * Returns false when cancellation has been requested. When progress is
   * supplied, it is validated and reported before cancellation is checked
   * again. Tools should return toolExecutionCancelled() after false.
   */
  readonly checkpoint: (progress?: ToolProgress) => boolean;
};

const validateProgress = (
  progress: ToolProgress,
  previousCompleted: number | undefined,
  previousTotal: number | undefined,
): ToolProgress => {
  if (!Number.isFinite(progress.completed) || progress.completed < 0) {
    throw new RangeError(
      "Progress completed must be a finite nonnegative number.",
    );
  }
  if (
    progress.total !== undefined &&
    (!Number.isFinite(progress.total) || progress.total < 0)
  ) {
    throw new RangeError("Progress total must be a finite nonnegative number.");
  }
  if (
    previousCompleted !== undefined &&
    progress.completed < previousCompleted
  ) {
    throw new RangeError("Progress must not move backward.");
  }
  if (
    previousTotal !== undefined &&
    progress.total !== undefined &&
    progress.total !== previousTotal
  ) {
    throw new RangeError("Progress total must remain constant.");
  }
  const total = progress.total ?? previousTotal;
  if (total !== undefined && progress.completed > total) {
    throw new RangeError("Progress completed must not exceed total.");
  }
  if (progress.message !== undefined && progress.message.trim() === "") {
    throw new RangeError("Progress message must not be empty.");
  }
  return total === undefined ? progress : { ...progress, total };
};

export const createToolExecutionControl = (
  context?: ToolExecutionContext,
): ToolExecutionControl => {
  let completed: number | undefined;
  let total: number | undefined;

  return {
    checkpoint: (progress) => {
      if (context?.signal?.aborted) return false;
      if (progress !== undefined) {
        const normalized = validateProgress(progress, completed, total);
        completed = normalized.completed;
        total = normalized.total;
        try {
          context?.reportProgress?.(normalized);
        } catch {
          // Observers must not change a calculation's result.
        }
      }
      return context?.signal?.aborted !== true;
    },
  };
};

export const progressInterval = (
  total: number,
  maximumReports = 100,
): number => {
  if (!Number.isSafeInteger(total) || total < 0) {
    throw new RangeError("Progress total must be a nonnegative safe integer.");
  }
  if (!Number.isSafeInteger(maximumReports) || maximumReports < 1) {
    throw new RangeError(
      "Maximum progress reports must be a positive safe integer.",
    );
  }
  return Math.max(1, Math.ceil(total / maximumReports));
};

export const shouldReportProgress = (
  completed: number,
  total: number,
  interval = progressInterval(total),
): boolean => {
  if (
    !Number.isSafeInteger(completed) ||
    completed < 0 ||
    !Number.isSafeInteger(total) ||
    total < 0 ||
    completed > total
  ) {
    throw new RangeError(
      "Progress counters must be nonnegative safe integers and completed must not exceed total.",
    );
  }
  if (!Number.isSafeInteger(interval) || interval < 1) {
    throw new RangeError("Progress interval must be a positive safe integer.");
  }
  return completed === total || completed % interval === 0;
};
