export const buttonVariants = {
  base: [
    "inline-flex items-center justify-center",
    "rounded-xl",
    "px-4 py-2.5",
    "font-semibold",
    "transition-all duration-200",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-offset-2",
  ].join(" "),

  primary: [
    "bg-primary-700",
    "text-text-inverse",
    "hover:bg-primary-800",
    "active:bg-primary-900",
    "focus-visible:ring-primary-500",
  ].join(" "),

  secondary: [
    "bg-surface",
    "text-text-primary",
    "border",
    "border-border",
    "hover:bg-surface-muted",
    "focus-visible:ring-primary-500",
  ].join(" "),

  danger: [
    "bg-danger-600",
    "text-text-inverse",
    "hover:bg-danger-700",
    "active:bg-danger-800",
    "focus-visible:ring-danger-500",
  ].join(" "),

  ghost: [
    "bg-transparent",
    "text-text-secondary",
    "hover:bg-surface-soft",
    "hover:text-text-primary",
    "focus-visible:ring-primary-500",
  ].join(" "),
};

export const statusPillVariants = {
  base: [
    "inline-flex items-center gap-2",
    "rounded-full",
    "border",
    "px-3 py-1",
    "text-xs font-semibold",
    "whitespace-nowrap",
  ].join(" "),

  critical: [
    "bg-status-critical-bg",
    "text-status-critical-text",
    "border-status-critical-border",
  ].join(" "),

  watch: [
    "bg-status-watch-bg",
    "text-status-watch-text",
    "border-status-watch-border",
  ].join(" "),

  stable: [
    "bg-status-stable-bg",
    "text-status-stable-text",
    "border-status-stable-border",
  ].join(" "),
};

export const statusDotVariants = {
  critical: "h-2 w-2 rounded-full bg-status-critical-dot",
  watch: "h-2 w-2 rounded-full bg-status-watch-dot",
  stable: "h-2 w-2 rounded-full bg-status-stable-dot",
};

export const statCardVariants = {
  base: [
    "rounded-xl",
    "border",
    "border-border-soft",
    "bg-surface",
    "p-5",
    "shadow-sm",
    "transition-all",
    "duration-200",
    "hover:border-primary-200",
    "hover:shadow-md",
  ].join(" "),

  icon: [
    "flex",
    "h-10",
    "w-10",
    "items-center",
    "justify-center",
    "rounded-lg",
    "bg-primary-50",
    "text-primary-700",
  ].join(" "),
};

export const alertVariants = {
  base: [
    "rounded-2xl",
    "border",
    "px-4 py-3",
  ].join(" "),

  critical: [
    "bg-status-critical-bg",
    "text-status-critical-text",
    "border-status-critical-border",
  ].join(" "),

  watch: [
    "bg-status-watch-bg",
    "text-status-watch-text",
    "border-status-watch-border",
  ].join(" "),

  stable: [
    "bg-status-stable-bg",
    "text-status-stable-text",
    "border-status-stable-border",
  ].join(" "),
};
export const dashboardCardVariants = {
  base: [
    "rounded-2xl",
    "border",
    "border-border-soft",
    "bg-surface",
    "p-6",
    "shadow-[0_4px_20px_rgba(15,23,42,0.04)]",
    "min-w-0",
  ].join(" "),
};
export const dashboardBadgeVariants = {
  base: [
    "inline-flex",
    "items-center",
    "rounded-lg",
    "px-2.5",
    "py-1.5",
    "text-[10px]",
    "font-bold",
    "uppercase",
    "tracking-wide",
  ].join(" "),

  overview: [
    "bg-primary-50",
    "text-primary-700",
  ].join(" "),
};
export const inventoryPanelVariants = {
  stable: [
    "border-status-stable-border",
  ].join(" "),

  watch: [
    "border-status-watch-border",
  ].join(" "),

  critical: [
    "border-status-critical-border",
  ].join(" "),

  iconStable: [
    "bg-status-stable-bg",
    "text-status-stable-text",
  ].join(" "),

  iconWatch: [
    "bg-status-watch-bg",
    "text-status-watch-text",
  ].join(" "),

  iconCritical: [
    "bg-status-critical-bg",
    "text-status-critical-text",
  ].join(" "),
};