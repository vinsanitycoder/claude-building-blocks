/** Base components for the design standard. Token-driven, framework-agnostic.
 *  The app must load globals.css (tokens) once; themes.css + a brand layer are optional on top. */
export { Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";
export { Input, Textarea } from "./Input";
export type { InputProps, TextareaProps } from "./Input";
export { Label, HelpText, ErrorText } from "./Label";
export type { LabelProps } from "./Label";
export { Card, CardTitle, CardDescription } from "./Card";
export type { CardProps } from "./Card";
export { Badge } from "./Badge";
export type { BadgeProps, BadgeVariant } from "./Badge";
export { Separator } from "./Separator";
export type { SeparatorProps } from "./Separator";
export { Spinner } from "./Spinner";
export type { SpinnerProps } from "./Spinner";
export { Skeleton } from "./Skeleton";

// — interactive set —
export { Switch } from "./Switch";
export type { SwitchProps } from "./Switch";
export { Checkbox } from "./Checkbox";
export type { CheckboxProps } from "./Checkbox";
export { RadioGroup, RadioGroupItem } from "./RadioGroup";
export type { RadioGroupProps, RadioGroupItemProps } from "./RadioGroup";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";
export type { TabsProps, TabsTriggerProps, TabsContentProps } from "./Tabs";
export { Tooltip } from "./Tooltip";
export type { TooltipProps } from "./Tooltip";
export { Dialog, DialogTitle, DialogDescription, DialogFooter } from "./Dialog";
export type { DialogProps } from "./Dialog";
export { Select, NativeSelect } from "./Select";
export type { SelectProps, SelectOption } from "./Select";
export { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "./DropdownMenu";
export type { DropdownMenuProps, DropdownMenuItemProps } from "./DropdownMenu";
export { ToastProvider, useToast } from "./Toast";
export type { ToastOptions, ToastVariant } from "./Toast";

// — data display & feedback —
export { Slider } from "./Slider";
export type { SliderProps } from "./Slider";
export { Progress } from "./Progress";
export type { ProgressProps } from "./Progress";
export { Avatar, AvatarGroup } from "./Avatar";
export type { AvatarProps, AvatarGroupProps, AvatarSize } from "./Avatar";
export { Alert } from "./Alert";
export type { AlertProps, AlertVariant } from "./Alert";
export { Kbd } from "./Kbd";
export type { KbdProps } from "./Kbd";
export { CodeBlock } from "./Code";
export type { CodeBlockProps } from "./Code";

// — layout & shell —
export { Stack, Container, Section } from "./Layout";
export type { StackProps, ContainerProps, SectionProps } from "./Layout";
export { TopBar, Sidebar, SidebarItem, AppShell, ShellMain } from "./Shell";
export type { TopBarProps, SidebarProps, SidebarItemProps } from "./Shell";
export { Breadcrumbs } from "./Breadcrumbs";
export type { BreadcrumbsProps, BreadcrumbItem } from "./Breadcrumbs";
export { Pagination } from "./Pagination";
export type { PaginationProps } from "./Pagination";

// — charts & date —
export { LineChart, BarChart, AreaChart, Sparkline } from "./Chart";
export type { BaseChartProps, Series, SparklineProps } from "./Chart";
export { Calendar } from "./Calendar";
export type { CalendarProps } from "./Calendar";

// — polish (overlay, disclosure, multi-step, cmdk) —
export { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from "./Drawer";
export type { DrawerProps } from "./Drawer";
export { Accordion, AccordionItem } from "./Accordion";
export type { AccordionProps, AccordionItemProps } from "./Accordion";
export { Stepper } from "./Stepper";
export type { StepperProps, StepperStep, StepStatus } from "./Stepper";
export { CommandPalette } from "./CommandPalette";
export type { CommandPaletteProps, CommandItem } from "./CommandPalette";
