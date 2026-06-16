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

// — everything-common batch (forms, anchored panels, data, entry) —
export { Field } from "./Field";
export type { FieldProps } from "./Field";
export { NumberInput } from "./NumberInput";
export type { NumberInputProps } from "./NumberInput";
export { SegmentedControl } from "./SegmentedControl";
export type { SegmentedControlProps, SegmentedOption } from "./SegmentedControl";
export { Popover } from "./Popover";
export type { PopoverProps } from "./Popover";
export { HoverCard } from "./HoverCard";
export type { HoverCardProps } from "./HoverCard";
export { Combobox } from "./Combobox";
export type { ComboboxProps, ComboboxOption } from "./Combobox";
export { DatePicker } from "./DatePicker";
export type { DatePickerProps } from "./DatePicker";
export { EmptyState } from "./EmptyState";
export type { EmptyStateProps } from "./EmptyState";
export { StatCard } from "./StatCard";
export type { StatCardProps } from "./StatCard";
export { DataTable } from "./DataTable";
export type { DataTableProps, Column } from "./DataTable";
export { FileUpload } from "./FileUpload";
export type { FileUploadProps } from "./FileUpload";
export { TagInput } from "./TagInput";
export type { TagInputProps } from "./TagInput";

// — unusual batch (hierarchy, edit, overlay, layout, feedback, auth) —
export { TreeView } from "./TreeView";
export type { TreeViewProps, TreeNode } from "./TreeView";
export { InlineEdit } from "./InlineEdit";
export type { InlineEditProps } from "./InlineEdit";
export { ContextMenu } from "./ContextMenu";
export type { ContextMenuProps, ContextMenuItem } from "./ContextMenu";
export { Resizable } from "./Resizable";
export type { ResizableProps } from "./Resizable";
export { Toolbar, ToggleGroup } from "./Toolbar";
export type { ToolbarProps, ToggleGroupProps, ToggleGroupOption } from "./Toolbar";
export { Timeline } from "./Timeline";
export type { TimelineProps, TimelineItem, TimelineTone } from "./Timeline";
export { Banner } from "./Banner";
export type { BannerProps, BannerVariant } from "./Banner";
export { OtpInput } from "./OtpInput";
export type { OtpInputProps } from "./OtpInput";

// — a few shared icons (the block ships a minimal inline set; real apps prefer Lucide/Tabler, §17) —
export { ListIcon, ColumnsIcon, TableIcon, BellIcon } from "./icons";

// — notifications (in-app inbox) —
export { NotificationCenter } from "./NotificationCenter";
export type { NotificationCenterProps, NotificationItem, NotificationSeverity } from "./NotificationCenter";

// — kanban (drag-and-drop board, dnd-kit) —
export { KanbanBoard, KanbanCardContent } from "./KanbanBoard";
export type { KanbanBoardProps, KanbanColumn, KanbanCard, CardMoveEvent, ColumnId, CardId, KanbanCardContentProps, KanbanLabel } from "./KanbanBoard";
