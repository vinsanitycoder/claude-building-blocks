import "../components.css";
import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds the hover-raise + press-settle interaction (use for clickable cards). */
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { interactive, className = "", ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={["ds-card", interactive ? "ds-card--interactive" : "", className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
});

export function CardTitle({ className = "", ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={["ds-card__title", className].filter(Boolean).join(" ")} {...rest} />;
}

export function CardDescription({ className = "", ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={["ds-card__desc", className].filter(Boolean).join(" ")} {...rest} />;
}
