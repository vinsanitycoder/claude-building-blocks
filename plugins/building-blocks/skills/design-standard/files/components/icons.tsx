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
export const UploadIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>);
export const CalendarIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...base(p)}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
export const BellIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /></svg>);
/* view switchers — list (rows), board (columns), table (grid) */
export const ListIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>);
export const ColumnsIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18" /></svg>);
export const TableIcon = (p: React.SVGProps<SVGSVGElement>) => (<svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18" /></svg>);
