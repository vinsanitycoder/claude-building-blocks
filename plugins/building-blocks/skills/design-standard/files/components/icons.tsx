import * as React from "react";

/** Minimal inline icon set (Lucide-style, currentColor stroke) so the block has zero icon-lib
 *  dependency. In a real app, prefer one icon set (Lucide/Tabler) per §17. */
const base = (props: React.SVGProps<SVGSVGElement>): React.SVGProps<SVGSVGElement> => ({
  width: "1em", height: "1em", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, ...props,
});

export const CheckIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M20 6 9 17l-5-5" /></svg>);
export const MinusIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M5 12h14" /></svg>);
export const ChevronDownIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>);
export const XIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M18 6 6 18M6 6l12 12" /></svg>);
export const InfoIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...base(p)}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>);
export const CheckCircleIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...base(p)}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>);
export const AlertIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z" /><path d="M12 9v4M12 17h.01" /></svg>);
