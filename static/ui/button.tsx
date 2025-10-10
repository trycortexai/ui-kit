import { cva, type VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import { cn } from "./cn";

const buttonVariants = cva(
	[
		"disabled:cursor-not-allowed relative isolate border-transparent inline-flex items-center justify-center gap-x-2 border font-medium",
		"focus:not-focus-visible:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
		"disabled:opacity-50",
		"*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) *:data-[slot=icon]:my-1 *:data-[slot=icon]:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:hover:[--btn-icon:ButtonText]",
	],
	{
		variants: {
			radius: {
				full: "[--radius:var(--radius-4xl)] rounded-4xl",
				md: "[--radius:var(--radius-md)] rounded-md",
				lg: "[--radius:var(--radius-lg)] rounded-lg",
				xl: "[--radius:var(--radius-xl)] rounded-xl",
				none: "[--radius:var(--radius-none)] rounded-none",
			},
			size: {
				xxs: [
					"px-[calc(--spacing(1.7)-1px)] py-[calc(--spacing(0)-1px)] text-[0.6875rem]",
					"*:data-[slot=icon]:size-3",
				],
				xs: [
					"px-[calc(--spacing(1.8)-1px)] py-[calc(--spacing(0)-1px)] text-xs/6",
				],
				sm: [
					"px-[calc(--spacing(2.5)-1px)] py-[calc(--spacing(1)-1px)] text-xs/6",
				],
				md: [
					"px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)] text-sm/6",
				],
				lg: [
					"px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2)-1px)] text-sm/6",
				],
				none: "leading-none",
			},
			variant: {
				solid: [
					"bg-(--btn-border)",
					"dark:bg-(--btn-bg)",
					"before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius)-1px)] before:bg-(--btn-bg)",
					"before:shadow-sm",
					"dark:before:hidden",
					"dark:border-white/5",
					"after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius)-1px)]",
					"after:shadow-[inset_0_1px_--theme(--color-white/15%)]",
					"data-[popup-open]:after:bg-(--btn-hover-overlay) hover:after:bg-(--btn-hover-overlay)",
					"dark:after:-inset-px dark:after:rounded-(--radius)",
					"disabled:before:shadow-none disabled:after:shadow-none",
				],
				outline: [
					"border-neutral-950/10 text-neutral-950 data-[popup-open]:bg-neutral-950/2.5 hover:bg-neutral-950/2.5",
					"dark:border-white/15 dark:text-white dark:[--btn-bg:transparent] dark:data-[popup-open]:bg-white/5 dark:hover:bg-white/5",
					"[--btn-icon:var(--color-neutral-500)] data-[popup-open]:[--btn-icon:var(--color-neutral-700)] hover:[--btn-icon:var(--color-neutral-700)] dark:data-[popup-open]:[--btn-icon:var(--color-neutral-400)] dark:hover:[--btn-icon:var(--color-neutral-400)]",
				],
				plain: [
					"text-neutral-950 data-[popup-open]:bg-neutral-950/5 hover:bg-neutral-950/5",
					"dark:text-white dark:data-[popup-open]:bg-white/10 dark:hover:bg-white/10",
				],
				soft: [
					"text-neutral-950 bg-neutral-950/5 data-[popup-open]:bg-neutral-950/10 hover:bg-neutral-950/10",
					"dark:text-white dark:bg-white/10 dark:hover:bg-white/15 dark:data-[popup-open]:bg-white/15",
				],
				none: "",
			},
			color: {
				"dark/white": [
					"text-white [--btn-bg:var(--color-neutral-900)] [--btn-border:var(--color-neutral-950)]/90 [--btn-hover-overlay:var(--color-white)]/10",
					"dark:text-neutral-950 dark:[--btn-bg:white] dark:[--btn-hover-overlay:var(--color-neutral-950)]/5",
				],
				primary: [
					"text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-primary-500)] [--btn-border:var(--color-primary-600)]/90",
					"[--btn-icon:var(--color-primary-300)] data-[popup-open]:[--btn-icon:var(--color-primary-200)] hover:[--btn-icon:var(--color-primary-200)]",
				],
			},
		},
	},
);

export type ButtonProps = React.ComponentPropsWithRef<"button"> &
	VariantProps<typeof buttonVariants>;

export default function Button({
	className,
	variant = "solid",
	color = "primary",
	radius,
	size = "md",
	...props
}: ButtonProps): React.ReactNode {
	const buttonClassName = cn(
		buttonVariants({
			variant,
			size,
			color: variant === "solid" ? color : undefined,
			radius:
				(size === "xs" || size === "xxs") && !radius ? "md" : radius || "lg",
		}),
		className,
	);

	return (
		<TouchTarget>
			<button
				data-slot="button"
				type="button"
				className={buttonClassName}
				{...props}
			/>
		</TouchTarget>
	);
}

function TouchTarget({ children }: PropsWithChildren) {
	return (
		<>
			<span
				className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 pointer-fine:hidden size-[max(100%,2.75rem)]"
				aria-hidden="true"
			/>
			{children}
		</>
	);
}
