import type { ReactNode } from "react";

export type ExternalLinkProps = {
    children: ReactNode;
    href: string;
    className?: string;
};

export function ExternalLink({
    children,
    href,
    className,
}: ExternalLinkProps): JSX.Element {
    return (
        <a
            href={href}
            rel="noreferrer noopener"
            target="_blank"
            className={className}
        >
            {children}
        </a>
    );
}
